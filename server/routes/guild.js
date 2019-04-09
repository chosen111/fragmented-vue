const express = require('express');
const router = express.Router();

const Fragmented = require('../util.js').Fragmented;

router.post('/addapplication', async (req, res) => {
  let result = await Fragmented.addApplication(req.user.battletag, req.body, "insert");
  res.json(result);
})
router.post('/editapplication', async (req, res) => {
  let result = await Fragmented.addApplication(req.user.battletag, req.body, "update");
  res.json(result);
})
router.post('/cancelapplication', async (req, res) => {
  let result = await Fragmented.cancelApplication(req.user.battletag);
  res.json(result);
})
router.post('/getapplication', async (req, res) => {
  let result = await Fragmented.getApplication(req.user.battletag);
  res.json(result);
})

module.exports = router;