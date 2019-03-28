var express = require('express');
var passport = require('passport');
var router = express.Router();

var Blizzard = require('./util.js').Blizzard;

var BnetStrategy = require('passport-bnet').Strategy;
var BNET_ID = "c6c7463498de4b988b45625bcd052eb5"
var BNET_SECRET = "W9mHstYdG2LeDn20PXaaOLpW1RbmNAeb"
 
// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
  clientID: BNET_ID,
  clientSecret: BNET_SECRET,
  callbackURL: "http://localhost:5000/blizzard/auth/callback",
  scope: "wow.profile",
  region: "eu"
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);
  })
}))

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

router.get('/auth/callback', passport.authenticate('bnet', { failureRedirect: "/user" }), function(req, res) {
  res.redirect(`/user/${req.user.battletag}`);
})

router.post('/profile', async function(req, res) {
  console.log(req.user);
  console.log(req.isAuthenticated());
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