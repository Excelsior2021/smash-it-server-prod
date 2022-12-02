const Stats = require("../models/statsModel");
const knex = require("knex")(require("../knexfile"));

const getGroupStats = async (req, res) => {
  const { groupName } = req.params;

  if (!groupName) return res.status(500).json("groupName not provided");

  try {
    const groupStats = await (
      await Stats.query().where("groupName", groupName)
    ).sort((a, b) => b.score - a.score);
    res.status(200).json(groupStats);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const updateStats = async (req, res) => {
  const {
    username,
    opponentUsername,
    scores: { userScore, opponentScore },
    groupName,
  } = req.body;

  if (
    !username ||
    !opponentUsername ||
    !groupName ||
    (!userScore && !username === 0) ||
    (!opponentScore && !opponentScore === 0)
  )
    return res.status(500).json("stats not provided");

  try {
    const userStats = await Stats.query()
      .first()
      .where("username", username)
      .where("groupName", groupName);

    await Stats.query()
      .findById(userStats.id)
      .patch({
        wins:
          parseInt(userScore) > parseInt(opponentScore)
            ? userStats.wins + 1
            : userStats.wins,
        loses:
          parseInt(userScore) < parseInt(opponentScore)
            ? userStats.loses + 1
            : userStats.loses,
        score:
          parseInt(userScore) > parseInt(opponentScore)
            ? userStats.score + 10
            : userStats.score,
        whitewashes:
          parseInt(userScore) === 6 && parseInt(opponentScore) === 0
            ? userStats.whitewashes + 1
            : userStats.whitewashes,
        whitewashed:
          parseInt(userScore) === 0 && parseInt(opponentScore) === 6
            ? userStats.whitewashed + 1
            : userStats.whitewashed,
        matches: userStats.matches + 1,
        updated_at: knex.fn.now(),
      });

    const opponentStats = await Stats.query()
      .first()
      .where("username", opponentUsername)
      .where("groupName", groupName);

    await Stats.query()
      .findById(opponentStats.id)
      .patch({
        wins:
          parseInt(opponentScore) > parseInt(userScore)
            ? opponentStats.wins + 1
            : opponentStats.wins,
        loses:
          parseInt(opponentScore) < parseInt(userScore)
            ? opponentStats.loses + 1
            : opponentStats.loses,
        score:
          parseInt(opponentScore) > parseInt(userScore)
            ? opponentStats.score + 10
            : opponentStats.score,
        whitewashes:
          parseInt(opponentScore) === 6 && parseInt(userScore) === 0
            ? opponentStats.whitewashes + 1
            : opponentStats.whitewashes,
        whitewashed:
          parseInt(opponentScore) === 0 && parseInt(userScore) === 6
            ? opponentStats.whitewashed + 1
            : opponentStats.whitewashed,
        matches: opponentStats.matches + 1,
        updated_at: knex.fn.now(),
      });

    res.status(201).json({ userStats, opponentStats });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  getGroupStats,
  updateStats,
};
