const express = require('express');
const mongodb = require('mongodb');
const indicative = require('indicative');
const util = require('util');
const error = require('./helpers').error;
const replaceId = require('./helpers').replaceId;
const router = express.Router();
const verifyToken = require('./verify-token');
const ObjectID = mongodb.ObjectID;
const validationRules = { 
    id: 'regex:^[0-9a-f]{24}$',
    userId: 'required|regex:^[0-9a-f]{24}$',
    name: 'required|string|max:80',
    category: 'required|string',
    isExpense: 'required|boolean',
    description: 'string|max:216',
    amount: 'required|number',
    isPeriodical: 'boolean',
    type: 'in:daily,monthly,yearly',
    lastDateInserted: 'date',
    publicationDate: 'date',
    lastModificationDate: 'date'
}

router.get('/:userId/transactions', verifyToken, function(req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.collection('transactions').find({userId: params.userId}).toArray(
        function (err, docs) {
            if (err) throw err;
            res.json({
                data: docs.map((transaction) => {
                    transaction.id = transaction._id;
                    delete transaction._id;
                    return transaction;
                })
            });
        }
    );
});


router.get('/:userId/savingsRate', verifyToken, function(req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.collection('transactions').find({userId: params.userId}).toArray().then(transactions => {
        res.json(transactions.map(singleTransaction => replaceId(singleTransaction)));
    });
});

router.post('/:userId/transactions', verifyToken, (req, res) => {
    const db = req.app.locals.db;
    const transaction = req.body;
    const params = req.params;
    transaction.userId = params.userId;
    transaction.registrationDate = new Date();
    transaction.lastModificationDate = new Date();
    if(req.body.isPeriodical){
        transaction.lastDateInserted = new Date();
    }
    indicative.validate(transaction, validationRules)
    .then(transaction => {
        console.log("Inserting transaction: ", transaction);
        db.collection('transactions').insertOne(transaction).then(result => {
            if(result.result.ok && result.insertedCount === 1) {
                replaceId(transaction);
                const uri = req.baseUrl + '/' + transaction._id
                res.location(uri).status(201).json(transaction);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid transaction: ${util.inspect(err)}`, err));
});

router.get('/:userId/transactions/:transactionId', verifyToken, (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
    .then(transaction => {
        console.log("Getting transaction: ", transaction);
        db.collection('transactions').find({"_id" : ObjectID(params.id)}).toArray().then(transactions => {
            console.log(transactions);
            res.json(transactions.map(singleTransaction => replaceId(singleTransaction)));
        });
    }).catch(err => error(req, res, 400, 
        `Invalid transaction: ${util.inspect(err)}`, err));
});

router.put('/:userId/transactions/:transactionId', verifyToken, (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const transaction = req.body;
    if(params.transactionId !== transaction.id) {
        error(req, res, 404, `Transaction IDs do not match: ${params.transactionId} vs. ${transaction.id} `)
    }
    //Check if the user is the same
    if(params.userId !== transaction.userId) {
        error(req, res, 404, `User IDs do not match: ${params.userId} vs. ${transaction.userId} `)
    }
    indicative.validate(transaction, validationRules)
    .then(transaction => {
        console.log("Updating transaction: ", transaction);
        transaction._id = new ObjectID(transaction.id);
        delete (transaction.id);
        transaction.lastModificationDate = new Date();
        db.collection('transactions').updateOne({ _id: transaction._id }, {"$set": transaction} )
        .then(result => {
            console.log("Changed transaction: ", transaction);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(transaction);
                res.status(200).json(transaction);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid transaction: ${util.inspect(err)}`, err));
});

router.delete('/:userId/transactions/:transactionId', verifyToken, function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
     
    indicative.validate(params, { transactionId: 'required|regex:^[0-9a-f]{24}$', userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('transactions').findOneAndDelete({_id: new ObjectID(params.transactionId)})
            .then(({ value }) => {
                if(value) {
                    replaceId(value);
                    res.json(value);
                } else {
                    error(req, res, 404, `Invalid transaction ID: ${params.transactionId}`)
                }
            });
        }).catch(err => error(req, res, 404, 
            `Invalid transaction ID: ${params.transactionId} or user ID ${params.userId}. Both should have 24 hexadecimal characters.`, err));
});


module.exports = router;