const crypto = require('crypto');

const getToken = () => {
  const tokenString = crypto.randomBytes(8).toString('hex');
  return tokenString;
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    const checkedEmail = regexEmail.test(email);
    if (!email) {
      return res.status(400).json(
        { message: 'O campo "email" é obrigatório' },
      ); 
    }
    if (!checkedEmail) {
      return res.status(400).json({ 
        message: 'O "email" deve ter o formato "email@email.com"' }); 
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const validatePassWord = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json(
      { message: 'O campo "password" é obrigatório' },
    ); 
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = {
  getToken,
  validateEmail,
  validatePassWord,
};