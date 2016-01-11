var express = require('express');
var app = express();

// We create the router object for our users resource
var user = express.Router();
// A GET to the root of a resource should return a list of objects
user.get('/', function(req, res) { });
// A POST to the root of a resource should create a new object
user.post('/', function(req, res) { });

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
