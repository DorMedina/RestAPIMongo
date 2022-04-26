const validateRegistration = require('../validations/registraion');
const validateSignin = require('../validations/signIn');
const { comparePassword, generatePassword } = require('../helpers/bcrypt');
const { generateAuthToken } = require('../helpers/token');
const authMiddleware = require('../../helpers/authMiddleware');

const router = require('express').Router();
const User = require('../models/model');
const _ = require('lodash');
const chalk = require('chalk');

//user register
router.post('/register', async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    console.log(chalk.redBright.bold(error.details[0].message));
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send('User already registered');
  }

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'biz']));

  user.password = generatePassword(user.password);
  await user.save();
  res.send(_.pick(user, ['name', 'email', 'password']));
});

router.post('/login', async (req, res) => {
  const { error } = validateSignin(req.body);
  if (error) {
    console.log(chalk.redBright.bold(error.details[0].message));
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send('Invalid Email');
  }

  const validPassword = comparePassword(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Wrong Password');
  }

  res.json({
    token: generateAuthToken(user),
    biz: user.biz,
  });
});

router.get('/userdata', authMiddleware, (req, res) => {
  let user = req.user;
  User.findById(user._id)
    .select('-password -_id -__v')
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;
