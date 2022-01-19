/**
 * Node js From Scratch.
 * Author : Kartik Panchal
 * date : 18/11/21
 */

//required dependenices.
const server = require('./lib/server');
const workers = require('./lib/workers');
const db = require('./lib/mongodb');

//app for all working.
var app = {};

//init method.
app.init = function(){
    //starting server.
    server.init();

    //starting workers.
    workers.init();

    //connecting database.
    db.init();
};

//execute init script.
app.init();

//exporting app.
module.exports = app;