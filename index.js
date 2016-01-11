var express = require('express');
var app = express();

// We create the router object for our users resource
var user = express.Router();
// A GET to the root of a resource should return a list of objects
user.get('/', function(req, res) { });
// A POST to the root of a resource should create a new object
user.post('/', function(req, res) { });
// We specify a param in our path for the GET of a specific object
user.get('/:username', function(req, res) { });
// Similar to the GET on an object, to update it we can PATCH
user.patch('/:username', function(req, res) { });
// Delete a specific object
user.delete('/:username', function(req, res) { });
// Now we must attach the router to its desired path
app.use('/user', user);

module.exports = app;
