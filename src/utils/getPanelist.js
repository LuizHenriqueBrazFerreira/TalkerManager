const fs = require('fs').promises;
const path = require('path');

const jsonPath = '../talker.json';

const getPanelist = async () => {
  const panelist = await fs.readFile(path.resolve(__dirname, jsonPath), 'utf-8');
  const parsedPanelist = JSON.parse(panelist);
  return parsedPanelist;
};

const writePanelist = async (pathData, data) => {
  await fs.writeFile(path.resolve(__dirname, pathData), data);
};

module.exports = { getPanelist, writePanelist };