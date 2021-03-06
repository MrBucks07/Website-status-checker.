/**
 * Configuration file for environment.
 */

//Creating container for environment.
var environments = {};

//Staging Environment.
environments.staging = {
    'httpPort' : process.env.PORT || 8000,
    'envName' : "Staging",
    'hashingSecret' : "thisistheHashingSecret",
    'maxchecks' : 3,
    'Twilio' : {
        'accountSid' : 'ACdd4d26b8d1c42e688fea7c805199ea09',
        'authToken' : '32ac1630dcfa85be89817627d83575a1',
        'fromMobileno' : '+18327803847'
    },
    'templateGlobals' : {
        'appName' : 'MR.BUCKS WEB CHECKER',
        'companyname' : 'Bucks Corporation, Inc',
        'year' : '2021',
        'baseurl' : 'https://mrbucks-web-checker.herokuapp.com/'
    }
}; 

//Production Environment.
environments.production = {
    'httpPort' : 7000,
    'envName' : "Production",
    'hashingSecret' : "thisistheHashingSecret",
    'maxchecks' : 3,
    'Twilio' : {
        'accountSid' : 'ACdd4d26b8d1c42e688fea7c805199ea09',
        'authToken' : '32ac1630dcfa85be89817627d83575a1',
        'fromMobileno' : '+18327803847'
    },
    'templateGlobals' : {
        'appName' : 'MR.BUCKS WEB CHECKER',
        'companyname' : 'DR DOX, Inc',
        'year' : '2021',
        'baseurl' : 'http://localhost:7000/'
    }
}

//Reading which env is specified in terminal.
var chosenEnv = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : "production";

//Environment to export.
var exportEnv = typeof(environments[chosenEnv]) == "object" ? environments[chosenEnv] : "No Environment";

module.exports = exportEnv;