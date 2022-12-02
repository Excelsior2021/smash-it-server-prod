const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");
const Stats = require("../models/statsModel");
const Counter = require("../models/counterModel");

const getUsers = async (_req, res) => {
  try {
    const users = await Users.query();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const getProfileData = async (req, res) => {
  const { username, groupName } = req.params;

  if (!username || !groupName)
    return res.status(500).json("username and/or groupname not provided");

  try {
    const profileData = await Users.query()
      .first()
      .select(
        "users.id",
        "firstName",
        "lastName",
        "dob",
        "users.username",
        "image"
      )
      .where("username", username);

    const statsData = await Stats.query()
      .first()
      .where("username", username)
      .where("groupName", groupName);

    res.status(200).json({ ...profileData, ...statsData });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const authenticate = async (req, res) => {
  if (!req.headers.authorization)
    return res.status(401).send("Authentication required");

  try {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).send("Invalid auth token");

      const userData = await Users.query()
        .first()
        .where("users.username", decoded.username);

      const groups = await Users.query()
        .joinRelated("stats")
        .select("groupName", "admin")
        .where("stats.username", decoded.username);

      delete userData.password;

      res.status(200).send({ ...userData, groups });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const login = async (req, res) => {
  if (!req.body.formData) return res.status(500).json("No form data recieved");

  const { username, password } = req.body.formData;

  if (!username || !password)
    return res.status(500).json("login details invalid");

  try {
    const userData = await Users.query()
      .first()
      .where("users.username", username);

    const checkPasswordStandard = password === userData.password;

    const checkPasswordBycrypt = bcrypt.compareSync(
      password,
      userData.password
    );

    if (!checkPasswordStandard && !checkPasswordBycrypt) {
      return res.status(400).send("Invalid password");
    }

    const groups = await Users.query()
      .joinRelated("stats")
      .select("groupName", "admin")
      .where("stats.username", username);

    const token = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        firstName: userData.firstName,
        lasttName: userData.lasttName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    delete userData.password;

    const counter = await Counter.query().findById(1);

    await Counter.query().patch({
      logins: counter.logins + 1,
    });

    res.status(200).json({ ...userData, groups, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const createAccount = async (req, res) => {
  if (!req.body.formData) return res.status(500).json("No form data recieved");

  const { firstName, lastName, dob, email, username, password, passwordCheck } =
    req.body.formData;

  if (
    (!firstName, !lastName, !dob, !email, !username, !password, !passwordCheck)
  )
    return res.status(500).json("form data invalid");

  if (
    !firstName ||
    !lastName ||
    !dob ||
    !email ||
    !username ||
    !password ||
    !passwordCheck
  ) {
    return res.status(400).send("Invalid field(s)");
  }

  if (password !== passwordCheck) {
    return res.status(400).send("Passwords do not match");
  }

  const hashedPassword = bcrypt.hashSync(password, 1);

  delete req.body.formData.passwordCheck;

  const newUser = {
    ...req.body.formData,
    password: hashedPassword,
  };

  const counter = await Counter.query().findById(1);

  await Counter.query().patch({
    newAccounts: counter.newAccounts + 1,
    logins: counter.logins - 1,
  });

  try {
    await Users.query().insert(newUser);
    delete newUser.password;
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  getUsers,
  getProfileData,
  authenticate,
  login,
  createAccount,
};
