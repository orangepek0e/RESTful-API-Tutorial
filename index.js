var express = require('express');
var bodyParser = require('body-parser');

var mongo = require('./lib/mongo');
var app = express();
app.use(bodyParser.json({ type: 'application/json'}));

// We create the router object for our users resource
var user = express.Router();
// A GET to the root of a resource should return a list of objects
user.get('/:username', lookupUser, function(req, res) {
    res.json(req.user);
});
user.post('/', function(req, res) {
    // We want to create a record object to store using
    // the inbound data from our POST body
    var userData = {
        username: req.body.username,
        profile_name: req.body.profile_name,
        email: req.body.email
    };
    // We retrieve a reference to the collection we'll insert into
    var collection = mongo.db.collection('users');
    // Then we insert one document into the collections
    collection.insertOne(userData, function(err, result) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.json({ errors: ['Could not create user'] });
        }
        // The HTTP status code 201 indicates a record was created
        res.statusCode = 201;
        res.send(userData);
    });
});

function lookupUser(req, res, next) {
    // We access the ID param on the request object
    var username = req.params.username;
    // We first specify which collection we want to look in
    var collection = mongo.db.collection('users');
    // Then we build our lookup, specifying the key name and value
    var result = collection.find({ username: username });
    // We convert the result to an array that we can read
    result.toArray(function(err, users) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({ errors: ['Could not retrieve user']});
        }
        // No results returned means the object is not found
        if (users && users.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({ errors: ['User not found'] });
        }
        // By attaching a User property to the request
        // its data is now made available in our handler function
        req.user = users[0];
        // Next tells the app to continue to our handler function
        next();
    });
}

// We specify a param in our path for the GET of a specific object
user.get('/:username', lookupUser, function(req, res) { });
// Similar to the GET on an object, to update it we can PATCH
user.patch('/:username', lookupUser, function(req, res) { });
// Delete a specific object
user.delete('/:username', lookupUser, function(req, res) { });
// Now we must attach the router to its desired path
app.use('/user', user);

module.exports = app;
