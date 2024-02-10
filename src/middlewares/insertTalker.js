const { getPanelist, writePanelist } = require('../utils/getPanelist');

const { jsonPath } = require('../utils/constants');

const validateAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json(
      { message: 'O "name" deve ter pelo menos 3 caracteres' },
    ); 
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18 || (age % 1 !== 0)) {
    return res.status(400).json(
      { message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' },
    ); 
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  
  next();
};

const validateWatched = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const checkWatched = dateRegex.test(watchedAt);
  if (!checkWatched) {
    return res.status(400).json(
      { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
    ); 
  }
  next();
};
const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (rate === undefined) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  if (rate < 1 || rate > 5 || rate % 1 !== 0) {
    return res.status(400).json(
      { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    ); 
  }
  next();
};

const registerTalker = async (info) => {
  const { name, age, talk } = info;
  const { watchedAt, rate } = talk;
  const panelist = await getPanelist();
  const newRegister = { id: panelist[panelist.length - 1].id + 1,
    name,
    age,
    talk: { watchedAt, rate } };
  const newTalkersList = JSON.stringify([...panelist, newRegister]);
  
  writePanelist(jsonPath, newTalkersList);
  return newRegister;
};

const validateId = async (req, res, next) => {
  const { id } = req.params;
  const panelist = await getPanelist();

  const findTalker = panelist.find((talker) => talker.id === Number(id));
  if (!findTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  next();
};

module.exports = {
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatched,
  validateRate,
  registerTalker,
  validateId,
};