const Card = require('../cards/models/model');
const lodash = require('lodash');

async function generateBizNum() {
  while (true) {
    const bizNum = lodash.random(100000, 9999999);
    const card = await Card.findOne({ bizNumber: bizNum });
    if (!card) return String(bizNum);
  }
}

exports.generateBizNum = generateBizNum;
