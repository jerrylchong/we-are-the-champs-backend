const { Group } = require("../models/Group");
const { arrangeStandings } = require("../utils/metrics");

// helper function to update group standings
// @Params
//   groupNo: group number to update
//   team: team that has been changed
const updateGroupStandings = async (groupNo, team) => {
  const group = await Group.findOne({ number: groupNo });
  if (!group) {
    console.log(`No group with number: ${groupNo}`);
    return;
  }

  // check if team is already in group
  if (group.teams) {
    const teams = [...group.teams];
    const teamIndex = teams.findIndex((t) => t.name === team.name);
    if (teamIndex >= 0) {
      teams[teamIndex] = team;
    } else {
      teams.push(team);
    }

    teams.sort(arrangeStandings);
    group.teams = teams;
  } else {
    group.teams = [team];
  }

  await group.save();
};

// Get groups
const getGroups = async (req, res) => {
  const groups = await Group.find();
  return res.status(200).json(groups);
};

// helper function to create group
const addGroup = async (groupNo) => {
  const newGroup = new Group({ number: groupNo, teams: [] });
  const addedGroup = await newGroup.save();
  return addedGroup;
};

const clearGroups = () => Group.deleteMany({});

module.exports = {
  updateGroupStandings,
  getGroups,
  addGroup,
  clearGroups,
};
