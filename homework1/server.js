const express = require('express');
const path  = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;

const usersRouter = require('./routes/users.routes.js');
const recipesRouter = require('./routes/recipes.routes.js');

const port  = 9000;

const rootPath = path.normalize(__dirname);

const app = express();

app.set('app', path.join(rootPath, 'app'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));

app.use('/api/users',  function(req, res, next) {next()}, usersRouter);
app.use('/api/users', recipesRouter);

app.use( function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err.error || err | {}
    });
});


const dburl = 'mongodb://localhost:27017/cooking';

MongoClient.connect(dburl, { useNewUrlParser: true }).then( db => {
    console.log("Database connected!");
    var database = db.db("cooking");
    database.createCollection("users", function(err, res) {
        if (err) throw err;
    });
    database.createCollection("recipes", function(err, res) {
        if (err) throw err;
    });
    app.locals.db = database;
    app.listen( port, err => {
        if(err) throw err;
        console.log(`Recipes API is listening on port ${port}`);
    });
}).catch(err => { 
    console.error("Error! MongoDB is probably not running.")
    throw err;
});