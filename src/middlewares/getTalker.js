const { getPanelist } = require('../utils/getPanelist');

const getTalker = async (_req, res, next) => {
  try {
    const panelist = await getPanelist();
    if (panelist.length > 0) return res.status(200).json(panelist);
    if (panelist.length === 0) return res.status(200).json([]);
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const getTalkerById = async (req, res, next) => {
  const { id } = req.params;
  const panelist = await getPanelist();
  try {
    const findPanelist = panelist.find((talker) => talker.id === Number(id));
    if (findPanelist) return res.status(200).json(findPanelist);
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const getTalkerByName = async (req, res, next) => {
  const { q } = req.query;
  const panelist = await getPanelist();
  if (q === undefined && panelist.length > 0) return res.status(200).json(panelist);
  if (q === undefined && panelist.length === 0) return res.status(200).json([]);
  next();
};

const getTalkerByRate = async (req, res, next) => {
  const { q, rate } = req.query;
  const panelist = await getPanelist();
  
};

module.exports = {
  getTalker,
  getTalkerById,
  getTalkerByName,
};