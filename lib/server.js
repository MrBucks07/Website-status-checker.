/**
 * All Server releted logic.
 */

//required dependencies.
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const envConfig = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');
const fs = require('fs');
const path = require('path');
const util = require('util');
const debuglog = util.debuglog('server');

//server (container for all functions).
var server = {};

//Common server for both http and https.
server.commonServerLogic = function (req, res) {

    //get method.
    var method = req.method.toLowerCase();

    //get the parsed url.
    var urlParsed = url.parse(req.url, true);

    //get the path from url.
    var path = urlParsed.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //queryString object.
    var queryStringObject = urlParsed.query;

    //get headers.
    var head = req.headers;

    //get payload.
    var decoder = new stringDecoder('utf-8');
    var buffer = "";

    //collect data till it comes.
    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    //finally send response.
    req.on("end", function () {
        buffer += decoder.end();

        //call the handler specified in url.
        var chosenHandler = typeof (server.routes[trimmedPath]) !== 'undefined' ? server.routes[trimmedPath] : handlers.notFound;

        chosenHandler = trimmedPath.indexOf("public/") > -1 ? handlers.public : chosenHandler;

        //data object to pass as handler parameter.
        var data = {
            'Method': method,
            'Headers': head,
            'Path': trimmedPath,
            'QueryParams': queryStringObject,
            'Payload': helpers.parseJsonToObject(buffer)
        };

        //calling chosen handler.
        chosenHandler(data, function (statuscode, payload, contentType) {
            //check status code is number.
            statuscode = typeof (statuscode) == 'number' ? statuscode : 200;
            //check content Type.
            contentType = typeof(contentType) == 'string' ? contentType : 'json'; 
            
            //sending response according to contentType specified.
            var payloadString = '';
            if(contentType == 'json'){
                res.setHeader('Content-Type','application/json');
                payload = typeof(payload) == 'object' ? payload : {};
                //converting payload to string.
                var payloadString = JSON.stringify(payload);
            }
            if(contentType == 'html'){
                res.setHeader('Content-Type','text/html');
                payloadString = typeof(payload) == 'string' ? payload : '';
            }
            if(contentType == 'css'){
                res.setHeader('Content-Type','text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if(contentType == 'plain'){
                res.setHeader('Content-Type','text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            //returning response.
            res.writeHead(statuscode);
            res.end(payloadString);

            //logging to console about req status.
            //if stsCode = 200 print in green otherwise red.
            if (statuscode == 200) {
                debuglog("\x1b[32m%s\x1b[0m",method.toUpperCase()+' /'+trimmedPath+' '+statuscode);
            } else {
                debuglog("\x1b[31m%s\x1b[0m",method.toUpperCase()+' /'+trimmedPath+' '+statuscode);
            }
        });
    });

};

//Instantiating http server.
server.httpServer = http.createServer(function (req, res) {
    server.commonServerLogic(req, res);
});

//Instantiating https server.
var httpsOptions = {
    'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.httpsServer = https.createServer(httpsOptions,function(req, res){
    server.commonServerLogic(req, res);
});

//routes for different pages.
server.routes = {
    "ping": handlers.ping,
    "" : handlers.index,
    "account/create" : handlers.accountCreate,
    "account/edit" : handlers.accountEdit,
    "account/deleted" : handlers.accountDeleted,
    "session/create" : handlers.sessionCreate,
    "session/deleted" : handlers.sessionDeleted,
    "checks/all" : handlers.checksAll,
    "check/create" : handlers.checkCreate,
    "check/edit" : handlers.checkEdit,
    "api/users": handlers.users,
    "api/tokens": handlers.tokens,
    "api/checks": handlers.checks,
    "public" : handlers.public
};


//Init script to start server.
server.init = function () {
    //Starting http server.
    // var httpport = process.env.PORT || envConfig.httpPort;
    server.httpServer.listen(process.env.PORT, function () {
        console.log("\x1b[33m%s\x1b[0m","Server Started on Port : "+envConfig.httpPort);
    });

    // var httpsport = process.env.PORT || envConfig.httpsPort;
    //Starting https server.
    server.httpsServer.listen(envConfig.httpsPort, function () {
        console.log("\x1b[33m%s\x1b[0m","Server Started on Port : "+envConfig.httpsPort);
    });
};


//exporting server.
module.exports = server;