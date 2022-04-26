const bcrypt = require('bcryptjs');

function generatePassword(password) {
  return bcrypt.hashSync(password, 10);
}


function comparePassword(password, anotherPassword) {
  return bcrypt.compareSync(password, anotherPassword);
}

module.exports = { generatePassword, comparePassword };
