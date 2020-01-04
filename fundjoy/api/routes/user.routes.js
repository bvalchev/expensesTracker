const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const replaceId = require('./helpers').replaceId;
const error = require('./helpers').error;
const util = require('util');
const indicative = require('indicative');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verify-token');
const cors = require('cors');
const verifyRole = require('./verify-role');
const validationRules = { 
    id: 'regex:^[0-9a-f]{24}$',
    name: 'required|string|min:2',
    username: 'required|string|max:150',//|unique:users,_username',
    password: 'required|string|min:6|max:20',
    role: 'required|integer|above:0|under:3'
}
const validationErrorMessages = {
    required: 'This field is required to complete the registration process',
    "name.min": 'The name must be at least 2 letters long',
    "username.max": 'The username should not be over 15 symbols',
    "password": "The password must be between 6 and 20 symbols"  
}

/*function isUsernameTaken(collection, newUsername){
    collection.find({username: newUsername},  (err, user) => {
        if(err){
            throw err;
        }
        replaceId(user);
        JSON.stringify(user);
        console.log(user);
        return user !== null;   
    });
};*/


// GET users list
router.get('/', verifyToken, verifyRole(2), function (req, res) {
    const db = req.app.locals.db;
    db.collection('users').find().toArray(
        function (err, docs) {
            if (err) throw err;
            res.json({
                data: docs.map((user) => {
                    user.id = user._id;
                    delete user._id;
                    delete user.password;
                    return user;
                })
            });
        }
    );
});

// GET users details
router.get('/:userId', verifyToken, function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('users', function (err, users_collection) {
                if (err) throw err;
                users_collection.findOne({ _id: new mongodb.ObjectID(params.userId) },
                    (err, user) => {
                        if (err) throw err;
                        if (user === null) {
                            error(req, res, 404, `User with Id=${params.userId} not found.`, err);
                        } else {
                            delete user.password;
                            replaceId(user);
                            res.json(user);
                        }

                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});

// Create new user
router.post('/', function (req, res, validationErrorMessages) {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, validationRules).then(() => {
        user.role  = 1;
        user.password = bcrypt.hashSync(user.password);
        const collection = db.collection('users');
        /*if(isUsernameTaken(collection, user.username)){
            error(req, res, 400, `Username taken: ${user.username}`);
            return;
        }*/
        console.log('Inserting user:', user);
        collection.insertOne(user).then((result) => {
            if (result.result.ok && result.insertedCount === 1) {
                delete user.password;
                replaceId(user);
                const uri = req.baseUrl + '/' + user.id;
                console.log('Created User: ', uri);
                res.location(uri).status(201).json(user);
            } else {
                error(req, res, 400, `Error creating new user: ${user}`);
            }
        }).catch((err) => {
            error(req, res, 500, `Server error: ${err}`, err);
        })
    }).catch(errors => {
        error(req, res, 400, util.inspect(errors));
    });
});

// PUT (edit) user by id
router.put('/:userId', verifyToken, function (req, res) {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, validationRules).then(() => {
        user.password = bcrypt.hashSync(user.password, 8);
        if (user.id !== req.params.userId) {
            error(req, res, 400, `Invalid user data - id in url doesn't match: ${JSON.stringify(user)}`);
            return;
        }
        const collection = db.collection('users');
        user._id = new mongodb.ObjectID(user.id);
        delete (user.id);
        console.log('Updating user:', user);
        collection.updateOne({ _id: new mongodb.ObjectID(user._id) }, { "$set": user })
            .then(result => {
                const resultUser = replaceId(user);
                if (result.result.ok && result.modifiedCount === 1) {
                    res.json(resultUser);
                } else {
                    error(req, res, 400, `Data was NOT modified in database: ${JSON.stringify(user)}`);
                }
            }).catch((err) => {
                error(req, res, 500, `Server error: ${err}`, err);
            })
    }).catch(errors => {
        error(req, res, 400, `Invalid user data: ${util.inspect(errors)}`);
    })
});

// DELETE users list
router.delete('/:userId', verifyToken, function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('users', function (err, users_collection) {
                if (err) throw err;
                users_collection.findOneAndDelete({ _id: new mongodb.ObjectID(params.userId) },
                    (err, result) => {
                        if (err) throw err;
                        if (result.ok) {
                            replaceId(result.value);
                            res.json(result.value);
                        } else {
                            error(req, res, 404, `User with Id=${params.userId} not found.`, err);
                        }
                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});


module.exports = router;
