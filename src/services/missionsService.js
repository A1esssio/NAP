const { readData, writeData } = require('./fileService');

let dataFilePath = null;

function init(filePath) {
  dataFilePath = filePath;
}

function findAll(mission_name) {
  const missions = readData(dataFilePath);
  if (!mission_name) return missions;
  return missions.filter((m) =>
    m.mission_name.toLowerCase().includes(mission_name.toLowerCase())
  );
}

function findOne(id) {
  const missions = readData(dataFilePath);
  return missions.find((m) => m.id === id) || null;
}

function findByDescription(description) {
  const missions = readData(dataFilePath);
  return missions.filter((m) =>
    m.description.toLowerCase().includes(description.toLowerCase())
  );
}

function create(missionData) {
  const missions = readData(dataFilePath);
  const maxId = missions.length > 0 ? Math.max(...missions.map((m) => m.id)) : 0;
  const newMission = { id: maxId + 1, ...missionData };
  missions.push(newMission);
  writeData(dataFilePath, missions);
  return newMission;
}

function update(id, data) {
  const missions = readData(dataFilePath);
  const index = missions.findIndex((m) => m.id === id);
  if (index === -1) return null;
  missions[index] = { ...missions[index], ...data };
  writeData(dataFilePath, missions);
  return missions[index];
}

function remove(id) {
  const missions = readData(dataFilePath);
  const index = missions.findIndex((m) => m.id === id)
  if (index === -1) return false;
  missions.splice(index, 1);
  writeData(dataFilePath, missions);
  return true;
}

module.exports = { init, findAll, findOne, findByDescription, create, update, remove };
