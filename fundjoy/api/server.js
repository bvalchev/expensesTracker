const express = require('express');
const path  = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
var cors = require('cors');

const transactionRouter = require('./routes/transaction.routes');
const usersRouter = require('./routes/user.routes');
const plansRouter = require('./routes/plan.routes');
const authRouter = require('./routes/auth.routes');

const port  = 9000;

const rootPath = path.normalize(__dirname);

const app = express();

app.set('app', path.join(rootPath, 'app'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));

app.use('/api/transaction', cors(), transactionRouter);
app.use('/api/users', cors(), usersRouter);
app.use('/api/auth', cors(), authRouter);
app.use('/api/planDetail', cors(), plansRouter)

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


const dburl = 'mongodb://localhost:27017/expensesDatabase';

MongoClient.connect(dburl, { useNewUrlParser: true }).then( db => {
    console.log("Database connected!");
    var database = db.db("expensesDatabase");
    database.createCollection("users", function(err, res) {
        if (err) console.log("users table exists");
    });
    database.createCollection("transactions", function(err, res) {
        if (err) console.log("transactions table exists");
    });
    database.createCollection("plans", function(err, res) {
        if (err) console.log("plans table exists");
    });
    app.locals.db = database;
    app.listen( port, err => {
        if(err) throw err;
        console.log(`Online finance API is listening on port ${port}`);
    });
}).catch(err => { 
    console.error("Error! MongoDB is probably not running.")
    throw err;
});