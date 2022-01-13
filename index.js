/**
 * Node js From Scratch.
 * Author : Kartik Panchal
 * date : 18/11/21
 */

//required dependenices.
const server = require('./lib/server');
const workers = require('./lib/workers');

//app for all working.
var app = {};

//init method.
app.init = function(){
    //starting server.
    server.init();

    //starting workers.
    workers.init();
};

//execute init script.
app.init();

//exporting app.
module.exports = app;