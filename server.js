const express = require('express');
const expressSession = require("express-session");
const knexSession = require('connect-session-knex')(expressSession);
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

const knex = require('./server/util.js').knex;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/dist')));
app.use(expressSession({ 
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
		maxAge: 60*60*24*365*1000
	},
	store: new knexSession({ 
		knex: knex,
		clearInterval: 900000
	})
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

var blizzard = require('./server/blizzard')
app.use('/blizzard', blizzard);

app.post('/session', (req, res) => {
	let response = {};
	// Check if session is logged
	if (req.body.session) {

	}
	response.bnet = req.user;
  res.json(response);
})

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
})

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
