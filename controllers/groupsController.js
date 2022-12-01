const Groups = require("../models/groupsModel");
const Users = require("../models/usersModel");
const Stats = require("../models/statsModel");

const getAllGroups = async (_req, res) => {
  try {
    const groups = await Groups.query();
    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
  }
};

const getUserGroups = async (req, res) => {
  const { username } = req.params;
  try {
    const groups = await Groups.query()
      .joinRelated("stats")
      .where("username", username);
    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
  }
};

const getGroup = async (_req, res) => {
  try {
    const group = await Groups.query().where("groupName", "brainstation");
    res.status(200).json(group);
  } catch (error) {
    console.log(error);
  }
};

const getMembers = async (req, res) => {
  const { group } = req.params;
  try {
    const members = await Groups.query()
      .where("groups_.groupName", group)
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
        "groups_.groupName"
      );
    res.status(200).json(members);
  } catch (error) {
    console.log(error);
  }
};

const addNewGroup = async (req, res) => {
  let { username, groupName } = req.body;

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
  }
};

const addMemberToGroup = async (req, res) => {
  const { username, groupName } = req.body;

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
};

const removeMemberFromGroup = async (req, res) => {
  const { username, groupName } = req.body;
  try {
    await Stats.query()
      .delete()
      .where("username", username)
      .where("groupName", groupName);
    res.status(200).json(`member removed from ${groupName}`);
  } catch (error) {
    console.log(error);
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
