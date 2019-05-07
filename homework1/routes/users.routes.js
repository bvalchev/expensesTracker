const express = require('express');
const mongodb = require('mongodb');
const indicative = require('indicative');
const util = require('util');
const bcrypt = require('bcrypt');
const error = require('./helpers').error;
const replaceId = require('./helpers').replaceId;
const router = express.Router();
const ObjectID = mongodb.ObjectID;
const defaultPicture = './pics/default.png';
const validationRules = { 
    id: 'regex:^[0-9a-f]{24}$',
    name: 'required|string|min:2',
    username: 'required|string|max:15',//|unique:users,_username',
    password: 'min:8|regex:^.*[0-9].*$|regex:^.*[^A-Za-z0-9].*$',
    gender: 'in:M,F',
    role: 'required|in:user,admin',
    picture: 'url',
    description: 'string|max:512',
    status: 'in:active,suspended,deactivated',
    registrationDate: 'date',
    lastModificationDate: 'date'
}



router.get('/', function(req, res) {
    const db = req.app.locals.db;
    db.collection('users').find().toArray().then(users => {
        res.json(users.map(singleUser => replaceId(singleUser)));
    });
});

router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const user = req.body;
    user.registrationDate = new Date();
    user.lastModificationDate = new Date();
    user.picture ? user.picture : defaultPicture;
    user.status = 'active';
   // await user.password = bcrypt.hash(user.password, 10);
    /* bcrypt.hash(user.password, 10).then(function(hash) {
        console.log(hash);
        user.password = hash;
    });*/
    console.log(user.password);
    indicative.validate(user, validationRules)
    .then(user => {
        user.password = bcrypt.hashSync(user.password, 10);
        console.log("Inserting user: ", user);
        db.collection('users').insertOne(user).then(result => {
            if(result.result.ok && result.insertedCount === 1) {
                replaceId(user);
                const uri = req.baseUrl + '/' + user._id
                res.location(uri).status(201).json(user);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid user: ${util.inspect(err)}`, err));
});

router.get('/:id', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
    .then(user => {
        console.log("Getting user: ", user);
        db.collection('users').find({"_id" : ObjectID(params.id)}).toArray().then(users => {
            console.log(users);
            res.json(users.map(singleUser => replaceId(singleUser)));
        });
    }).catch(err => error(req, res, 400, 
        `Invalid user: ${util.inspect(err)}`, err));
});

router.put('/:id', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const user = req.body;
    if(params.id !== user.id) {
        error(req, res, 404, `User ID does not match: ${params.id} vs. ${user.id} `)
    }
    indicative.validate(user, validationRules)
    .then(user => {
        user.password = bcrypt.hashSync(user.password, 10);
        user.lastModificationDate = new Date();
        console.log("Updating user: ", user);
        user._id = new ObjectID(user.id);
        delete (user.id);
        db.collection('users').updateOne({ _id: user._id }, {"$set": user} )
        .then(result => {
            console.log("User to insert: ", user);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(user);
                res.status(200).json(user);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid user: ${util.inspect(err)}`, err));
});

router.delete('/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('users').findOneAndDelete({_id: new ObjectID(params.id)})
            .then(({ value }) => {
                if(value) {
                    replaceId(value);
                    res.json(value);
                } else {
                    error(req, res, 404, `Invalid user ID: ${params.id}`)
                }
            });
        }).catch(err => error(req, res, 404, 
            `Invalid user ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});



module.exports = router;