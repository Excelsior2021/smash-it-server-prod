const Groups = require("../models/groupsModel");
const Users = require("../models/usersModel");
const Stats = require("../models/statsModel");

const getAllGroups = async (_req, res) => {
  try {
    const groups = await Groups.query();
    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const getUserGroups = async (req, res, next) => {
  const { username } = req.params;

  if (!username) return res.status(500).json("username not provided");

  try {
    const groups = await Groups.query()
      .joinRelated("stats")
      .where("username", username);

    if (groups.length === 0) return next();

    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const getGroup = async (req, res) => {
  const { groupName } = req.params;

  if (!groupName) return res.status(500).json("groupName not provided");

  try {
    const group = await Groups.query().where("groupName", groupName);
    res.status(200).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const getMembers = async (req, res) => {
  const { groupName } = req.params;

  if (!groupName) return res.status(500).json("group not provided");

  try {
    const members = await Groups.query()
      .where("groups_.groupName", groupName)
      .joinRelated("users")
      .select(
        "userId",
        "firstName",
        "lastName",
        "users.username",
        "wins",
        "loses",
        "matches",
        "tournaments",
        "leagues",
        "score",
        "image",
        "groups_.groupName",
        "admin"
      );

    res.status(200).json(members);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const addNewGroup = async (req, res) => {
  let { username, groupName } = req.body;

  if (!username || !groupName)
    return res.status(500).json("username and/or groupName not provided");

  groupName = groupName.toLowerCase();

  try {
    const newGroup = await Groups.query().insert({ groupName });

    const user = await Users.query()
      .first()
      .select("id")
      .where("username", username);

    const newStatRecord = await Stats.query().insert({
      userId: user.id,
      username,
      groupName,
      admin: true,
      groupId: newGroup.id,
    });
    res.status(201).json({ newGroup, newStatRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const addMemberToGroup = async (req, res) => {
  const { username, groupName } = req.body;

  if (!username || !groupName)
    return res.status(500).json("username and/or groupName not provided");

  try {
    const record = await Stats.query()
      .first()
      .select("stats.username", "stats.groupName")
      .where("stats.username", username)
      .where("stats.groupName", groupName);

    if (record) {
      return res.status(409).send("User already in group");
    }

    const user = await Users.query()
      .first()
      .select("id")
      .where("username", username);

    const group = await Groups.query()
      .first()
      .select("id")
      .where("groupName", groupName);

    const newMember = await Stats.query().insert({
      username,
      groupName,
      userId: user.id,
      groupId: group.id,
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const removeMemberFromGroup = async (req, res) => {
  const { username, groupName } = req.body;

  if (!username || !groupName)
    return res.status(500).json("username and/or groupName not provided");

  try {
    await Stats.query()
      .delete()
      .where("username", username)
      .where("groupName", groupName);
    res.status(200).json(`member removed from ${groupName}`);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  getAllGroups,
  getUserGroups,
  getGroup,
  getMembers,
  addNewGroup,
  addMemberToGroup,
  removeMemberFromGroup,
};
