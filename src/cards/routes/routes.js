const validateCard = require('../validation/newCard');
const authMiddleware = require('../../helpers/authMiddleware');
const { generateBizNum } = require('../../helpers/generateBizNum');

const router = require('express').Router();
const Card = require('../models/model');
const User = require('../../users/models/model');
const _ = require('lodash');
const chalk = require('chalk');

//create new card
router.post('/newcard', authMiddleware, async (req, res) => {
  try {
    //save userid for the card
    const userInfo = req.user;

    //check if the user is biz
    if (!userInfo.biz) {
      console.log(chalk.redBright.bold('User is not biz'));
      return res.status(403).send('User is not biz');
    }
    //check if we get all card variables
    const { error } = validateCard(req.body);
    if (error) {
      console.log(chalk.redBright.bold(error.details[0].message));
      return res.status(400).send(error.details[0].message);
    }

    //create unique number for the card
    const bizNumber = await generateBizNum();

    //create the card
    let card = new Card(
      _.pick(req.body, ['name', 'description', 'image', 'phone', 'address'])
    );
    card.userID = userInfo._id;
    card.bizNumber = bizNumber;

    //save the card
    await card.save();

    res.send(card);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find all cards

router.get('/allcards', authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find();
    return res.send(cards);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

//find all user card
router.get('/usercards', authMiddleware, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) return res.status(403).json(' Unauthorize user!');

    await Card.find({ userID: user._id }).then((cards) => {
      if (cards.length === 0) {
        return res.status(404).send('User does not has any cards');
      }
      return res.json(cards);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//find specific card
router.get('/card/:cardid', authMiddleware, (req, res) => {
  const userInfo = req.user;
  const cardId = req.params.cardid;

  const filter = {
    _id: cardId,
    userID: userInfo._id,
  };

  //search for user
  Card.findOne(filter)
    .then((x) => {
      //if we dont found a card match to the user
      if (!x) {
        return res.status(403).json('This Buisness is not yours!');
      }
      res.json(x);
    })
    .catch((x) => res.status(500).json(x));
});

//edit card
router.put('/:cardid', authMiddleware, (req, res) => {
  const updatedCard = req.body;
  const userInfo = req.user;
  const cardId = req.params.cardid;

  const filter = {
    _id: cardId,
    userID: userInfo._id,
  };

  //search for user
  Card.updateOne(filter, updatedCard)
    .then((x) => res.send(x))
    .catch((x) => res.status(500).json(x));
});

//delte card
router.delete('/:cardid', authMiddleware, (req, res) => {
  const userInfo = req.user;
  const cardId = req.params.cardid;

  const filter = {
    _id: cardId,
    userID: userInfo._id,
  };

  Card.deleteOne(filter)
    .then((x) => {
      if (x.deletedCount == 0) {
        return res.send('No card has deleted');
      }
      res.send(x);
    })
    .catch((x) => res.status(500).json(x));
});

module.exports = router;
