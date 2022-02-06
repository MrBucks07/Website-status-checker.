/**
 * Background workers for check checking.
 */

//required dependencies.
const http = require('http');
const https = require('https');
const url = require('url');
const _data = require('./crud');
const helpers = require('./helpers');
const _log = require('./log');
const util = require('util');
const debuglog = util.debuglog('workers');
const logModel = require('../modelsAndSchemas/logSchema');
const checkModel = require('../modelsAndSchemas/checkSchema');

//worker for all check related functions.
var workers = {};

//gathering all check.
workers.collectAllChecks = async function(){
    try {
        //get all checks.
        var checksArray = await checkModel.find({}, {_id:0});
        checksArray.forEach(function(checkData){
            workers.validateChecks(checkData);
        });
    } catch (error) {
        
    }


    // _data.list('checks',function(err,checks){
    //     if (!err && checks && checks.length > 0) {
    //         console.log(checks);
    //         console.log(typeof(checks));
    //         //checks is an array and check is an single check.
    //         //reading all checks.
    //         checks.forEach( async function(check){
    //             //reading checks from db.
    //             //var logdata = logModel.fin
    //             _data.read('checks',check,function(err,checkData){
    //                 if (!err && checkData) {
    //                     //validating check data.
    //                     workers.validateChecks(checkData);
    //                 } else {
    //                     debuglog("I think some checks left to read.");
    //                 }
    //             });
    //         });
    //     } else {
    //         debuglog("Either no checks found or some error occured.");
    //     }
    // });
}; 

//validating all check.
workers.validateChecks = function(checkData){
    //Validating : checkData,protocol,url,method,successCodes,timeoutSeconds.
    checkData = typeof(checkData) == 'object' && checkData !== null ? checkData : {} ;
    ///***///
    checkData.checkId = typeof(checkData.checkId) == 'string' && checkData.checkId.length == 15 ? checkData.checkId : false ;
    checkData.mobileno = typeof(checkData.mobileno) == 'number' && checkData.mobileno.trim().length == 10 ? checkData.mobileno : false ;
    var protocols = ['http','https'];
    checkData.protocol = typeof(checkData.protocol) == 'string' && protocols.indexOf(checkData.protocol) > -1 ? checkData.protocol : false ;
    checkData.url = typeof(checkData.url) == 'string' ? checkData.url : false ;
    var methods = ['post','get','put','delete'];
    checkData.method = typeof(checkData.method) == 'string'  && methods.indexOf(checkData.method) > -1 ? checkData.method : false ; 
    checkData.successCodes = typeof(checkData.successCodes) == 'object' && checkData.successCodes instanceof Array && checkData.successCodes.length > 0 ? checkData.successCodes : false ;
    checkData.timeoutSeconds = typeof(checkData.timeoutSeconds) == 'number' && checkData.timeoutSeconds % 1 == 0 && checkData.timeoutSeconds > 0 && checkData.timeoutSeconds < 5 ? checkData.timeoutSeconds : false ;

    // set the state and timestamp if not there.
    checkData.state = typeof(checkData.state) == 'string' && ['up','down'].indexOf(checkData.state) > -1 ? checkData.state : 'down' ;
    checkData.lastChecked = typeof(checkData.lastChecked) == 'number' && checkData.lastChecked > 0  ? checkData.lastChecked : false;

    if (checkData.checkId &&
        checkData.mobileno &&
        checkData.protocol && 
        checkData.url && 
        checkData.method && 
        checkData.successCodes && 
        checkData.timeoutSeconds) {

        workers.performCheck(checkData);
    } else {
        debuglog("Error validating some Check Data");
    }
};

//performing check.
workers.performCheck = function(checkData){
    //check outcome.
    var checkOutcome = {
        'error' : false,
        'responseCode' : false
    };

    var outcomeSent = false;

    var parsedUrl = url.parse(checkData.protocol+'://'+checkData.url,true);
    var hostname = parsedUrl.hostname;
    var path = parsedUrl.path;

    var requestDetails = {
        'protocol' : checkData.protocol+':',
        'hostname' : hostname,
        'method' : checkData.method.toUpperCase(),
        'path' : path,
        'timeout' : checkData.timeoutSeconds * 1000
    };

    //Making request to server.
    var _protocolToUsed = checkData.protocol == 'http' ? http : https ;

    var req =_protocolToUsed.request(requestDetails,function(res){
        var statuscode = res.statusCode;
        checkOutcome.responseCode = statuscode;
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData,checkOutcome);
            outcomeSent = true;
        }
    });

    //binding with events so that req does not kills thread.
    req.on('error',function(e){
        checkOutcome.error = {
            'error' : true,
            'value' : e
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData,checkOutcome);
            outcomeSent = true;
        }
    });
    req.on('timeout',function(e){
        checkOutcome.error = {
            'error' : true,
            'value' : 'timeout'
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData,checkOutcome);
            outcomeSent = true;
        }
    });
    req.end();
};

//process check outcome and trigger sms alert if needed.
workers.processCheckOutcome = async function(checkData,checkOutcome){
    //in check data successCodes are stored as string.
    var successCodesStrArray = checkData.successCodes;
    //converting array of string type successCodes to number.
    //because response code is of number type.
    var successCodesNumArray = successCodesStrArray.map(Number);
    console.log(successCodesNumArray);
    var state = !checkOutcome.error && checkOutcome.responseCode && successCodesNumArray.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //deciding wether sms alert needed.
    var alertWanted = checkData.lastChecked && checkData.state !== state ? true : false ;
    
    //logging checkData and checkOutcome to .logs.
    var timeOfCheck = Date.now();
    workers.log(checkData,checkOutcome,state,alertWanted,timeOfCheck);
    
    //updating check data.
    try {
        await checkModel.findOneAndUpdate(
            {checkId : checkData.checkId},
            {
                state : state,
                lastTimeOfCheck : timeOfCheck
            }
        );
        console.log("Check state updated.");
    } catch (error) {
        console.log("Check state not updated.");
    }
};

//alert user with sms about check.
workers.alertUser = function(updateCheckData){
    var msg = "Alert : Your Check for "+updateCheckData.method.toUpperCase()+" "+updateCheckData.protocol+"://"+updateCheckData.url+" is "+updateCheckData.state;
    helpers.sendTwilioSms(updateCheckData.mobileno,msg,function(err){
        if (!err) {
            debuglog("Successfully alerted user with check state.");
        } else {
            debuglog(err);
            debuglog("Could not alert user with sms about check.");
        }
    });
};

//logging to .logs file.
workers.log = async function(checkData,checkOutcome,state,alertWanted,timeOfCheck){
    try {
        //logging object.
        var checkLog = new logModel(
            {
                'check' : checkData,
                'checkOutcome' : checkOutcome,
                'state' : state,
                'alertWanted' : alertWanted,
                'timeOfCheck' : timeOfCheck
            }
        );
        await checkLog.save();
        debuglog("logged file successfully");
    } catch (error) {
        debuglog("Could not logged file.");
    }
};

//rotating logs to.
workers.rotateLogs = async function(){
    //listing logs to compress.
    // _log.list(false,function(err,logs){
    //     if (!err && logs && logs.length > 0) {
    //         logs.forEach(function(logname){
    //             var newFileName = logname+'-'+Date.now();
    //             //compressing logs.
    //             _log.compress(logname,newFileName,function(err){
    //                 if (!err) {
    //                     //truncating logs after compressing.
    //                     _log.truncate(logname,function(err){
    //                         if (!err) {
    //                             debuglog("Success.");
    //                         } else {
    //                             debuglog(err);
    //                         }
    //                     });
    //                 } else {
    //                     debuglog("Error compressing logs.");
    //                 }
    //             });
    //         });
    //     } else {
    //         debuglog("Error listing logs.");
    //     }
    // });
};

//loop for logsRotation.
workers.logRotationLoop = function(){
    setInterval(function(){
        workers.rotateLogs();
    },1000 * 60 * 60 * 24);
};

//looping for checking.
workers.loop = function(){
    setInterval(function(){
        workers.collectAllChecks();
    },1000 * 60);
};

//Init script for performing checks.
workers.init = function(){

    //logging in green.
    console.log("\x1b[32m%s\x1b[0m","Background workers started");

    //executing collect checks immediately.
    workers.collectAllChecks();

    //loop for collecting and checking cheks.
    workers.loop();

    //executing rotate logs immediately.
    workers.rotateLogs();

    //loop for compressing and rotating logs.
    workers.logRotationLoop();
};

//exporting workers.
module.exports = workers;