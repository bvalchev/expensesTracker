const express = require('express');
const mongodb = require('mongodb');
const indicative = require('indicative');
const util = require('util');
const error = require('./helpers').error;
const replaceId = require('./helpers').replaceId;
const router = express.Router();
const ObjectID = mongodb.ObjectID;
const validationRules = { 
    id: 'regex:^[0-9a-f]{24}$',
    userId: 'required|regex:^[0-9a-f]{24}$',
    name: 'required|string|max:80',
    shortDescription: 'string|max:216',
    time: 'integer',
    product: 'json',
    picture: 'required|url',
    detailedDescription: 'string|max:2048',
    keywords: 'json',
    publicationDate: 'date',
    lastModificationDate: 'date'
}

router.get('/:userId/recipes', function(req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    db.collection('recipes').find({userId: params.userId}).toArray().then(recipes => {
        res.json(recipes.map(singleRecipe => replaceId(singleRecipe)));
    });
});

router.post('/:userId/recipes', (req, res) => {
    const db = req.app.locals.db;
    const recipe = req.body;
    const params = req.params;
    recipe.userId = params.userId;
    recipe.registrationDate = new Date();
    recipe.lastModificationDate = new Date();
    indicative.validate(recipe, validationRules)
    .then(recipe => {
        console.log("Inserting recipe: ", recipe);
        db.collection('recipes').insertOne(recipe).then(result => {
            if(result.result.ok && result.insertedCount === 1) {
                replaceId(recipe);
                const uri = req.baseUrl + '/' + recipe._id
                res.location(uri).status(201).json(recipe);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid recipe: ${util.inspect(err)}`, err));
});

router.put('/:userId/recipes/:recipeId', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const recipe = req.body;
    if(params.recipeId !== recipe.id) {
        error(req, res, 404, `Recipe IDs do not match: ${params.recipeId} vs. ${recipe.id} `)
    }
    //Check if the user is the same
    if(params.userId !== recipe.userId) {
        error(req, res, 404, `User IDs do not match: ${params.userId} vs. ${recipe.userId} `)
    }
    indicative.validate(recipe, validationRules)
    .then(recipe => {
        console.log("Updating recipe: ", recipe);
        recipe._id = new ObjectID(recipe.id);
        delete (recipe.id);
        recipe.lastModificationDate = new Date();
        db.collection('recipes').updateOne({ _id: recipe._id }, {"$set": recipe} )
        .then(result => {
            console.log("Changed recipe: ", recipe);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(recipe);
                res.status(200).json(recipe);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid recipe: ${util.inspect(err)}`, err));
});

router.delete('/:userId/recipes/:recipeId', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
     
    indicative.validate(params, { recipeId: 'required|regex:^[0-9a-f]{24}$', userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('recipes').findOneAndDelete({_id: new ObjectID(params.recipeId)})
            .then(({ value }) => {
                if(value) {
                    replaceId(value);
                    res.json(value);
                } else {
                    error(req, res, 404, `Invalid recipe ID: ${params.recipeId}`)
                }
            });
        }).catch(err => error(req, res, 404, 
            `Invalid recipe ID: ${params.recipeId} or user ID ${params.userId}. Both should have 24 hexadecimal characters.`, err));
});


module.exports = router;