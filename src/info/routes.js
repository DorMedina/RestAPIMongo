const router = require('express').Router();

router.get('/', (req, res) => {
  return res.json('Info');
});

module.exports = router;
