/**
 * Helpers for different files.
 */

//dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const path = require('path');
const fs = require('fs');

//Helpers Container.
var helpers = {};

//hash password
helpers.hashPassword = function(str){
    if (typeof(str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

//parse Json To Object.
helpers.parseJsonToObject = function(str){
    try {
        var object = JSON.parse(str);
        return object;
    } catch (error) {
        return {};
    }
};

//create random string(token) for user.
helpers.createRandomString = function(strlen){
    
    //checking that stringlen given is valid or not.
    strlen = typeof(strlen) == 'number' && strlen > 0 ? strlen : false ;

    if (strlen) {
        
        //character used to create random token.
        var usableCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
        var str = '';
        for(i=1 ; i<=strlen ; i++){
    
            //selecting random char from usableCharacters.
            var selChar = usableCharacters.charAt(Math.floor(Math.random() * usableCharacters.length));
            //appending it to str.
            str+=selChar;
        };
    
        return str;
    } else {
        return false
    }
};

//HelperLibrary for Twilio api Integration.
helpers.sendTwilioSms = function(mobileno,msg,callback){
    //Required parameter : mobileno and msg.
    mobileno = typeof(mobileno) == 'string' && mobileno.trim().length == 10 ? mobileno : false ;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false ;

    if (mobileno && msg) {
        //Creating Request payload.
        var payload = {
            'From' : config.Twilio.fromMobileno,
            'To' : '+91'+mobileno,
            'Body' : msg
        };

        //stringify Payload.
        var stringPayload = new URLSearchParams(payload).toString();

        //configuring request payload.
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.twilio.com',
            'method' : 'POST',
            'path' : '/2010-04-01/Accounts/'+config.Twilio.accountSid+'/Messages.json',
            'auth' : config.Twilio.accountSid+':'+config.Twilio.authToken,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(stringPayload)
            }
        };

        //sending https request.
        var req = https.request(requestDetails,function(res){
            var statuscode = res.statusCode;
            if (statuscode == 200 || statuscode == 201) {
                callback(false);
            } else {
                callback("Status Code : "+statuscode);
            } 
        });

        //bind to error event so that it throws error but does not kill thread.
        req.on('error',function(e){
            callback(e);
        });
        //if no error in sending request write string payload.
        req.write(stringPayload);
        //ending request now no more data should be written.
        req.end();

    } else {
        callback("Incorrect mobileno or msg.(or fields not provided (mobileno and msg).)");
    }
};

//get template helper.
helpers.getTemplate = function(tempName,data,callback){
    tempName = typeof(tempName) == 'string' && tempName.length > 0 ? tempName : false;
    data = typeof(data) == 'object' && data !== null ? data : {};
    if (tempName) {
        var tempDir = path.join(__dirname,'/../templates/');
        fs.readFile(tempDir+tempName+'.html','utf8',function(err,string){
            if (!err && string && string.length > 0) {
                var finalString = helpers.interpolate(string,data);
                callback(false,finalString);
            } else {
                callback(500,"Internal error cannot read template.");
            }
        });
    } else {
        callback("Invalid tempName specified.");
    }
};

//interpolate string.
helpers.interpolate = function(str,data){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    //replacing key values in data object in string.
    for(var keyname in config.templateGlobals){
        if (config.templateGlobals.hasOwnProperty(keyname)) {
            data['global.'+keyname] = config.templateGlobals[keyname];
        }
    };

    //replacing key values in string
    for(var key in data){
        if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
            var replace = data[key];
            var find = "{"+key+"}";
            str = str.replace(find,replace);
        }
    };
    return str;
};

//joining universal header and footer.
helpers.joinHeadFoot = function(str,data,callback){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    helpers.getTemplate('_header',data,function(err,headerstring){
        if (!err && headerstring) {
            helpers.getTemplate('_footer',data,function(err,footerstring){
                if (!err && footerstring) {
                    var finalString = headerstring+str+footerstring;
                    callback(false,finalString);
                } else {
                    callback("Footer template not found.");
                }
            });
        } else {
            callback("Header template not found.");
        }
    });
};

//get static asset.
helpers.getStaticAsset = function(assetName,callback){
    assetName = typeof(assetName) == 'string' && assetName.length > 0 ? assetName : false;
    if (assetName) {
        var publicDir = path.join(__dirname,'/../public/');
        fs.readFile(publicDir+assetName,function(err,data){
            if (!err && data) {
                callback(false,data)
            } else {
                callback("Asset not found.");
            }
        });
    } else {
        callback("Invalid Asset Name");
    }
};

//exporting helpers.
module.exports = helpers;