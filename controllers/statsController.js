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
    !userScore ||
    !opponentScore
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
        wins: userScore > opponentScore ? userStats.wins + 1 : userStats.wins,
        loses:
          userScore < opponentScore ? userStats.loses + 1 : userStats.loses,
        score:
          userScore > opponentScore ? userStats.score + 10 : userStats.score,
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
          opponentScore > userScore
            ? opponentStats.wins + 1
            : opponentStats.wins,
        loses:
          opponentScore < userScore
            ? opponentStats.loses + 1
            : opponentStats.loses,
        score:
          opponentScore > userScore
            ? opponentStats.score + 10
            : opponentStats.score,
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
