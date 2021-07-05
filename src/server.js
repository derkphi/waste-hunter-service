const database = require('./db.js');
const auth = require('./authentication.js');
const express = require('express');
const path = require('path');

//const path = require('path');

const users = [
    {username: 'philipp', password: 'WasteHunter'},
    {username: 'christop', password: 'WasteHunter'},
    {username: 'reto', password: 'WasteHunter'}
  ]

// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
};

// fn to create express server
const create = async () => {

    // server
    const app = express();

    // configure nonFeature
    app.use(ignoreFavicon);
    app.use(express.json());

    // root route - serve static file
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client.html'));
    });

    app.post('/api/login', (req, res) => {
        if(!req.body.username || !req.body.password){
            console.log('Login: Username and or password not provided');
            res.sendStatus(400);
        } else {
            let success = false;
            users.filter(function(user){
                if(user.username === req.body.username && user.password === req.body.password){
                    console.log('Login: ' + user.username);
                    const token = auth.generateAccessToken(user.username);
                    res.json(token);
                    success = true;
                }
            });
            if (!success) {
                console.log('Login: Invalid username or password');
                res.sendStatus(401);
            }
        }
    })
    
    app.post('/api/event', auth.authenticateToken, (req, res) => {
        if(!req.body.location || !req.body.time){
            console.log('Event: Location and or time not provided');
            res.sendStatus(400);
        } else {
            const collection = database.get().collection("Events");

            collection.insertOne({location: req.body.location, time: req.body.time}, function(dbErr, dbRsp) {
            if (dbErr) throw dbErr;
            console.log("Event inserted");
            res.sendStatus(200);
            });
        }
    })
    
    app.get('/api/event', auth.authenticateToken, (req, res) => {
        const collection = database.get().collection("Events");
        
        collection.find({}).toArray(function(dbErr, dbRsp) {
            if (dbErr) throw dbErr;
            dbRsp.forEach(function(v){ delete v._id });
            res.json(dbRsp);
        });
    })

    // Error handler
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
    return app;
};

module.exports = {
    create
};
