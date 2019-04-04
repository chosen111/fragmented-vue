const express = require('express');
const router = express.Router();

const Fragmented = require('../util.js').Fragmented;

router.post('/addapplication', async (req, res) => {
  let result = await Fragmented.addApplication(req.body);
  res.json(result);
})

module.exports = router;