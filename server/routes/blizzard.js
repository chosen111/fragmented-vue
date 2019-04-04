const express = require('express');
const passport = require('passport');
const router = express.Router();

const Blizzard = require('../util.js').Blizzard;
const BnetStrategy = require('passport-bnet').Strategy;

// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
  clientID: Blizzard.BNET_ID,
  clientSecret: Blizzard.BNET_SECRET,
  callbackURL: "http://localhost:8080/blizzard/auth/callback",
  scope: "wow.profile",
  region: "eu"
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);
  })
}))

router.use(async(req, res, next) => {
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

router.post('/guild/members', async(req, res) => {
  let result = await Blizzard.getGuildMembers("Fragmented", "Silvermoon");
  res.json(result);
})

router.post('/characters', async(req, res) => {
  let result = await Blizzard.getCharacters(req.body.token);
  if (result.error) {
    req.logout();
  }
  res.json(result);
})

router.post('/auth/logout', async(req, res) => {
  req.logout();
  res.json({});
})

router.get('/auth/callback', 
  function(req, res, next) {
    if (req.header('Referer') != undefined) req.session.redirect = req.header('Referer').split("?")[0];
    next();
  },
  passport.authenticate('bnet', { failureRedirect: '/' }),
  function(req, res) {
    let redirect = (req.session.redirect) ? `${req.session.redirect}?login=success` : `/user/${req.bnet.battletag}`;
    res.redirect(redirect);
  });

router.post('/profile', async function(req, res) {
  res.json({});
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