const express = require('express');
const router = express.Router();

const WarcraftLogs = require('./util.js').WarcraftLogs;

router.post('/getranking', async(req, res) => {
  let result = await WarcraftLogs.getRanking(req.body.character, req.body.realm);
  res.json(result);
})

module.exports = router;