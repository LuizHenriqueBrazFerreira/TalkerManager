const express = require('express');
const { getTalker, getTalkerById, getTalkerByName } = require('./middlewares/getTalker');
const { getToken, validateEmail, validatePassWord } = require('./middlewares/validateLogin');
const {
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatched,
  validateRate,
  registerTalker,
  validateId,
} = require('./middlewares/insertTalker');
const { writePanelist, getPanelist } = require('./utils/getPanelist');
const { jsonPath } = require('./utils/constants');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker/search', validateAuthorization, getTalkerByName, async (req, res) => {
  const { q } = req.query;
  const panelist = await getPanelist();
  const filteredTalkerByName = panelist.filter(({ name }) => name.includes(q));
  res.status(200).json(filteredTalkerByName);
});

app.get('/talker', getTalker, (_req, res) => res.status(404)
  .json({ message: 'Pessoa palestrante não encontrada' }));

app.get('/talker/:id', getTalkerById, (_req, res) => res.status(404)
  .json({ message: 'Pessoa palestrante não encontrada' }));

app.post('/login', validateEmail, validatePassWord, (_req, res) => {
  const tokenId = getToken();
  res.status(200).json({ token: tokenId });
});

app.post('/talker', 
  validateAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatched,
  validateRate,
  async (req, res) => {
    const infoTalker = req.body;
    const newTalker = await registerTalker(infoTalker);
    console.log(newTalker);
    res.status(201).json(newTalker); 
  });

app.put('/talker/:id', 
  validateAuthorization,
  validateId,
  validateName,
  validateAge,
  validateTalk,
  validateWatched,
  validateRate, async (req, res) => {
    const { id } = req.params;
    const talker = req.body;
    const panelist = await getPanelist();
    const { talk } = talker;
    const updatedTalker = { id: Number(id),
      name: talker.name,
      age: talker.age,
      talk: {
        watchedAt: talk.watchedAt,
        rate: talk.rate,
      } };
    const newTalkersList = panelist.filter((speaker) => speaker.id !== Number(id));
    const updatedTalkersList = JSON.stringify([...newTalkersList, updatedTalker]);
    writePanelist(jsonPath, updatedTalkersList);
    return res.status(200).json(updatedTalker);
  });

app.delete('/talker/:id', validateAuthorization, async (req, res) => {
  const { id } = req.params;
  const panelist = await getPanelist();
  const removedTalker = panelist.filter((speaker) => speaker.id !== Number(id));
  writePanelist(jsonPath, JSON.stringify(removedTalker));
  res.status(204).end();
});
