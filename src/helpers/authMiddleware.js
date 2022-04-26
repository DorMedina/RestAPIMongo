const { checkToken } = require('../users/helpers/token');

function authMiddleware(req, res, next) {
  //get user token from the request
  const userToken = req.header('token');
  //check if the user send token
  if (!userToken) {
    return res.status(401).send('Please send token');
  }

  //get user data by token
  const userData = checkToken(userToken);
  //if the token is invalid we'll get an error
  if (!userData) {
    return res.status(401).send('Invalid Token cannot get user data');
  }

  req.user = userData;

  next();
}

module.exports = authMiddleware;
