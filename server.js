const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '/dist')));

var blizzard = require('./server/blizzard')
app.use('/blizzard', blizzard);

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
