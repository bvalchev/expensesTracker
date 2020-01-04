const express = require('express');
const mongodb = require('mongodb');
const indicative = require('indicative');
const util = require('util');
const error = require('./helpers').error;
const replaceId = require('./helpers').replaceId;
const verifyToken = require('./verify-token');
const router = express.Router();
const ObjectID = mongodb.ObjectID;
const validationRules = { 
    id: 'regex:^[0-9a-f]{24}$',
    userId: 'required|regex:^[0-9a-f]{24}$',
    name: 'required|string|max:80',
    description: 'string|max:216',
    amount: 'required|number',
    endDate: 'required|date', 
    publicationDate: 'date',
    lastModificationDate: 'date'
}

router.get('/:userId/plans', verifyToken, function(req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.collection('plans').find({userId: params.userId}).toArray(
        function (err, docs) {
            if (err) throw err;
            res.json({
                data: docs.map((plan) => {
                    plan.id = plan._id;
                    delete plan._id;
                    return plan;
                })
            });
        }
    );
});

router.post('/:userId/plans', verifyToken, (req, res) => {
    const db = req.app.locals.db;
    const plan = req.body;
    const params = req.params;
    plan.userId = params.userId;
    plan.registrationDate = new Date();
    plan.lastModificationDate = new Date();
    indicative.validate(plan, validationRules)
    .then(plan => {
        console.log("Inserting plan: ", plan);
        db.collection('plans').insertOne(plan).then(result => {
            if(result.result.ok && result.insertedCount === 1) {
                replaceId(plan);
                const uri = req.baseUrl + '/' + plan._id
                res.location(uri).status(201).json(plan);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid plan: ${util.inspect(err)}`, err));
});

router.get('/:userId/plans/:planId', verifyToken, (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
    .then(plan => {
        console.log("Getting plan: ", plan);
        db.collection('plan').find({"_id" : ObjectID(params.id)}).toArray().then(plans => {
            console.log(plans);
            res.json(plans.map(singlePlan => replaceId(singlePlan)));
        });
    }).catch(err => error(req, res, 400, 
        `Invalid plan: ${util.inspect(err)}`, err));
});

router.put('/:userId/plans/:planId', verifyToken, (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const plan = req.body;
    if(params.planId !== plan.id) {
        error(req, res, 404, `Plan IDs do not match: ${params.planId} vs. ${plan.id} `)
    }
    //Check if the user is the same
    if(params.userId !== plan.userId) {
        error(req, res, 404, `User IDs do not match: ${params.userId} vs. ${plan.userId} `)
    }
    indicative.validate(plan, validationRules)
    .then(plan => {
        console.log("Updating plan: ", plan);
        plan._id = new ObjectID(plan.id);
        delete (plan.id);
        plan.lastModificationDate = new Date();
        db.collection('plan').updateOne({ _id: plan._id }, {"$set": plan} )
        .then(result => {
            console.log("Changed plan: ", plan);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(plan);
                res.status(200).json(plan);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid plan: ${util.inspect(err)}`, err));
});

router.delete('/:userId/plans/:planId', verifyToken, function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
     
    indicative.validate(params, { planId: 'required|regex:^[0-9a-f]{24}$', userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('plans').findOneAndDelete({_id: new ObjectID(params.planId)})
            .then(({ value }) => {
                if(value) {
                    replaceId(value);
                    res.json(value);
                } else {
                    error(req, res, 404, `Invalid plan ID: ${params.planId}`)
                }
            });
        }).catch(err => error(req, res, 404, 
            `Invalid plan ID: ${params.planId} or user ID ${params.userId}. Both should have 24 hexadecimal characters.`, err));
});


module.exports = router;