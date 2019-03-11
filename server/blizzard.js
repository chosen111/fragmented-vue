var express = require('express')
var router = express.Router()

var Blizzard = require('./util.js').Blizzard;

router.use(async function(req, res, next) {
  await Blizzard.getToken();
  if (req.method == "POST") {
    //await Blizzard.getToken();
    next()
  }
  else {
    //res.redirect("back");
    next()
  }
})

router.post('/guild/members', async function(req, res) {
  let result = await Blizzard.getGuildMembers("Fragmented", "Silvermoon");
  res.json(result);
})
/*
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

var list = ["item1", "item2", "item3"];
res.json(list);
console.log('Sent list of items');
*/

module.exports = router