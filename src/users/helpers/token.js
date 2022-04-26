const jwt = require('jsonwebtoken');
const config = require('config');

function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, biz: user.biz },
    config.get('jwtKey')
  );
  return token;
}

function checkToken(userToken) {
  try {
    const userData = jwt.verify(userToken, config.get('jwtKey'));
    return userData;
  } catch {
    return null;
  }
}

module.exports = { generateAuthToken, checkToken };
