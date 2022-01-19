/**
 * Handlers for handling different routes.
 */

//Required dependencies.
// const _data = require('./crud');
const userModel = require('../modelsAndSchemas/userSchema');
const tokenModel = require('../modelsAndSchemas/tokenSchema');
const helpers = require('./helpers');
var envConfig = require('./config');

//Container for all handlers.
var handlers = {};

//ping handler to check that server is alive.
handlers.ping = function (data, callback) {
    callback(200, { "Msg": "Server is online." });
};

/**
 * Html Handlers.
 */

//index page handler.
handlers.index = function (data, callback) {
    //checking that the request is get req.
    if (data.Method == 'get') {
        var tempData = {
            'head.title': 'Website status Checker.',
            'head.description': 'This is an web site checker,create check and stay updated about status of website.',
            'body.class': 'index'
        };
        //calling get template function.
        helpers.getTemplate('index', tempData, function (err, tempstr) {
            // console.log(tempstr);
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        callback(200, finaltempstr, 'html');
                    } else {
                        callback(405, undefined, 'html');
                    }
                });
            } else {
                console.log(err);
                callback(400, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};



//create account page handler.
handlers.accountCreate = function (data, callback) {
    //only allowing get request.
    if (data.Method == 'get') {
        var tempData = {
            'head.title': 'Creating Account.',
            'head.description': 'Create account in few steps.',
            'body.class': 'createAccount'
        };
        //calling get template function.
        helpers.getTemplate('createAccount', tempData, function (err, tempstr) {
            // console.log(tempstr);
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, 'html');
                    } else {
                        callback(405, undefined, 'html');
                    }
                });
            } else {
                console.log(err);
                callback(400, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};



//create session page handler(login page).
handlers.sessionCreate = function (data, callback) {
    //only allowing get request.
    if (data.Method == 'get') {
        var tempData = {
            'head.title': 'Logging User.',
            'head.description': 'Logging in user in his account.',
            'body.class': 'createSession'
        };
        //calling get template function.
        helpers.getTemplate('createSession', tempData, function (err, tempstr) {
            // console.log(tempstr);
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, 'html');
                    } else {
                        callback(405, undefined, 'html');
                    }
                });
            } else {
                console.log(err);
                callback(400, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};



//create session page handler(login page).
handlers.sessionDeleted = function (data, callback) {
    //only allowing get request.
    if (data.Method == 'get') {
        var tempData = {
            'head.title': 'Logging Out.',
            'head.description': 'Logged out of your account..',
            'body.class': 'sessionDeleted'
        };
        //calling get template function.
        helpers.getTemplate('sessionDeleted', tempData, function (err, tempstr) {
            // console.log(tempstr);
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, 'html');
                    } else {
                        callback(405, undefined, 'html');
                    }
                });
            } else {
                console.log(err);
                callback(400, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};



//dashboard handler.
handlers.checksAll = function (data, callback) {
    if (data.Method == "get") {
        var tempData = {
            'head.title': 'User Dashboard.',
            'head.description': 'In user dashboard you can preview or manage your checks.',
            'body.class': 'dashboard'
        };
        //getting dashboard template.
        helpers.getTemplate('dashboard', tempData, function (err, tempstr) {
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, "html");
                    } else {
                        callback(405, undefined, "html");
                    }
                });
            } else {
                callback(404, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};



//edit account page handler.
handlers.accountEdit = function (data, callback) {
    if (data.Method == "get") {
        var tempData = {
            'head.title': 'Edit Account.',
            'body.class': 'editAccount'
        };
        //getting dashboard template.
        helpers.getTemplate('editAccount', tempData, function (err, tempstr) {
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, "html");
                    } else {
                        callback(405, undefined, "html");
                    }
                });
            } else {
                callback(404, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};


//deletd account page handler.
handlers.accountDeleted = function (data, callback) {
    if (data.Method == "get") {
        var tempData = {
            'head.title': 'Edit Account.',
            'head.description': 'Your account has been deleted.',
            'body.class': 'deletedAccount'
        };
        //getting dashboard template.
        helpers.getTemplate('accountDeleted', tempData, function (err, tempstr) {
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, "html");
                    } else {
                        callback(405, undefined, "html");
                    }
                });
            } else {
                callback(404, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};


//create check page handler.
handlers.checkCreate = function (data, callback) {
    if (data.Method == "get") {
        var tempData = {
            'head.title': 'Create Check',
            'body.class': 'createCheck'
        };
        //getting dashboard template.
        helpers.getTemplate('createCheck', tempData, function (err, tempstr) {
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, "html");
                    } else {
                        callback(405, undefined, "html");
                    }
                });
            } else {
                callback(404, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};


//edit check page handler.
handlers.checkEdit = function (data, callback) {
    if (data.Method == "get") {
        var tempData = {
            'head.title': 'Editing Check',
            'body.class': 'editCheck'
        };
        //getting dashboard template.
        helpers.getTemplate('editCheck', tempData, function (err, tempstr) {
            if (!err && tempstr) {
                //calling add universal header and footer function.
                helpers.joinHeadFoot(tempstr, tempData, function (err, finaltempstr) {
                    if (!err && finaltempstr) {
                        // console.log(finaltempstr);
                        callback(200, finaltempstr, "html");
                    } else {
                        callback(405, undefined, "html");
                    }
                });
            } else {
                callback(404, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};


//public asset handler.
handlers.public = function (data, callback) {
    if (data.Method == 'get') {
        var assetName = data.Path.replace('public/', '').trim();

        helpers.getStaticAsset(assetName, function (err, data) {
            if (!err && data) {
                var contentType = 'plain';
                if (assetName.indexOf('.css') > -1) {
                    contentType == 'css'
                }
                if (assetName.indexOf('.png') > -1) {
                    contentType == 'png'
                }
                if (assetName.indexOf('.jpg') > -1) {
                    contentType == 'jpg'
                }
                callback(200, data, contentType);
            } else {
                callback(405);
            }
        });
    }
};









/**
 * JSON api Handlers.
 */

//users handler.
handlers.users = function (data, callback) {
    var acceptedMethods = ['post', 'get', 'put', 'delete'];
    if (acceptedMethods.indexOf(data.Method) > -1) {
        handlers._users[data.Method](data, callback);
    } else {
        callback(405, { "Error": "Method not allowed." });
    }
};

//Container for _users.
handlers._users = {};

//_users post method handler.
handlers._users.post = async function (data, callback) {

    var fullname = typeof (data.Payload.fullname) == 'string' && data.Payload.fullname.trim().length > 2 ? data.Payload.fullname.trim() : false;
    var username = typeof (data.Payload.username) == 'string' && data.Payload.username.trim().length > 2 ? data.Payload.username.trim() : false;
    var mobileno = typeof (data.Payload.mobileno) == 'string' && data.Payload.mobileno.trim().length == 10 ? data.Payload.mobileno.trim() : false;
    var password = typeof (data.Payload.password) == 'string' && data.Payload.password.trim().length > 2 ? data.Payload.password.trim() : false;

    try {
        if (fullname && username && mobileno && password) {
            var userdata = await userModel.findOne({ mobileno: mobileno });
            console.log(userdata);
            if (userdata == null) {
                var user = new userModel(
                    { fullname, username, mobileno, password }
                );
                try {
                    await user.save();
                    console.log("User created.");
                    callback(200, { "Error": "User Created Successfully." });

                } catch (error) {
                    console.log(error);
                    callback(500, { "Error": "Database error could not create new user." });
                }

            } else {
                callback(405, { "Error": "User with this mobileno already exist." });
            }
        } else {
            callback(404, { "Error": "Missing Required Input Fields." })
        }
    } catch (error) {
        callback(500, { "Error": "Server error a" });
    }
    // _data.read('users',mobileno,function(err,userdata){
    //     if (!err && userdata) {
    //         console.log(userdata);
    //         callback(405,{"Error" : "User already exist."});
    //     } else {
    //         var hashPassword = helpers.hashPassword(password);
    //         if (hashPassword) {
    //             var userObject = {
    //                 "fullname" : fullname,
    //                 "username" : username,
    //                 "mobileno" : mobileno,
    //                 "password" : hashPassword
    //             };
    //             _data.create('users',mobileno,userObject,function(err){
    //                 if (!err) {
    //                     callback(200,{"Msg" : "User created successfully"});
    //                 } else {
    //                     callback(500,{"Error" : "Could not create new useer."});
    //                 }
    //             });
    //         } else {
    //             callback(400,{"Error" : "Error hashing password."});
    //         }
    //     }
    // });
};

//_users get method handler.
handlers._users.get = function (data, callback) {

    //to access user data mobile number and token is must.
    var mobileno = typeof (data.QueryParams.mobileno) == 'string' && data.QueryParams.mobileno.trim().length == 10 ? data.QueryParams.mobileno : false;

    try {
        if (mobileno) {
            //token to verify that user with this mobileno is requesting its data.
            var token = typeof (data.Headers.token) == 'string' ? data.Headers.token : false;
            if (token) {
                //verify that token is of authenticated user.
                handlers.verifyToken(token, mobileno, async function (validToken) {
                    if (validToken) {
                        var userdata = await userModel.findOne({ mobileno : mobileno });
                        callback(200,userdata);
                    } else {
                        callback(403, { "Error": "Invalid token." });
                    }
                });
            } else {
                callback(404, { "Error": "Token not provided in headers." });
            }
        } else {
            callback(404, { "Error": "Invalid mobile number." });
        }
    } catch (error) {
        callback(500, { "Error": "Server error b" });
    }
};

//_users put method handler. 
handlers._users.put = function (data, callback) {

    //Required field : MobileNo.
    var mobileno = typeof (data.Payload.mobileno) == 'string' && data.Payload.mobileno.trim().length == 10 ? data.Payload.mobileno : false;

    //Optional field to update : fullname, username, password.
    var fullname = typeof (data.Payload.fullname) == 'string' && data.Payload.fullname.trim().length > 2 ? data.Payload.fullname.trim() : false;
    var username = typeof (data.Payload.username) == 'string' && data.Payload.username.trim().length > 2 ? data.Payload.username.trim() : false;
    var password = typeof (data.Payload.password) == 'string' && data.Payload.password.trim().length > 2 ? data.Payload.password.trim() : false;

    if (mobileno && (fullname || username || password)) {

        //token to verify that user with this mobileno is updating data.
        var token = typeof (data.Headers.token) == 'string' && data.Headers.token.trim().length == 20 ? data.Headers.token : false;
        if (token) {

            //verifying that token is of authenticated user.
            handlers.verifyToken(token, mobileno, function (validToken) {
                if (validToken) {

                    //First see that the user try to update exist or not.
                    _data.read('users', mobileno, function (err, userdata) {

                        if (!err && userdata) {

                            //Converting to object to update data.
                            var userobj = helpers.parseJsonToObject(userdata);
                            if (fullname) {
                                userobj.fullname = fullname;
                            }
                            if (username) {
                                userobj.username = username;
                            }
                            if (password) {
                                userobj.password = helpers.hashPassword(password);
                            }
                            //Finally updating data.
                            _data.update('users', mobileno, userobj, function (err) {

                                if (!err) {
                                    callback(200, { "Msg": "Updated data successfully" });
                                } else {
                                    console.log(err);
                                    callback(500, { "Error": "Error updating user" });
                                }
                            });
                        } else {
                            console.log(err);
                            callback(404, { "Error": "User you try to update doesnot exist." });

                        }
                    });
                } else {
                    callback(403, { "Error": "Invalid token." });
                }
            });
        } else {
            callback(400, { "Error": "Token not provided in headers." });
        }
    } else {
        callback(404, { "Error": "Mobile no or updating data not provided." })
    }
};

//_users delete method handler.
handlers._users.delete = function (data, callback) {
    //Required field to delete user : Mobile no
    var mobileno = typeof (data.QueryParams.mobileno) == 'string' && data.QueryParams.mobileno.trim().length == 10 ? data.QueryParams.mobileno : false;
    if (mobileno) {

        //token to verify that user with this mobileno is deleting data.
        var token = typeof (data.Headers.token) == 'string' && data.Headers.token.trim().length == 20 ? data.Headers.token : false;
        if (token) {

            //verifying that token is of authenticated user.
            handlers.verifyToken(token, mobileno, function (validToken) {
                if (validToken) {

                    //Checking that user you try to delete exist or not
                    _data.read('users', mobileno, function (err, userdata) {
                        if (!err && userdata) {
                            //Deleting user
                            _data.delete('users', mobileno, function (err) {
                                if (!err) {
                                    //converting userdata to userobject.
                                    var userobj = helpers.parseJsonToObject(userdata);
                                    //getting user checks.
                                    var usersChecks = typeof (userobj.checks) == 'object' && userobj.checks instanceof Array ? userobj.checks : [];
                                    var checksToDel = usersChecks.length;

                                    if (checksToDel > 0) {
                                        var checksDeleted = 0;
                                        var deletionError = false;

                                        //looping throug checks array and deleting.
                                        usersChecks.forEach(function (checkId) {
                                            //deleting check.
                                            _data.delete('checks', checkId, function (err) {
                                                if (!err) {
                                                    checksDeleted++;
                                                } else {
                                                    deletionError = true;
                                                }
                                                if (checksDeleted == checksToDel) {
                                                    if (!deletionError) {
                                                        callback(200, { "Msg": "User with all its data is deleted." });
                                                    } else {
                                                        callback(500, { "Error": "Could not delete some checks due to internal error." });
                                                    }
                                                }
                                            });
                                        });
                                    } else {
                                        callback(200);
                                    }
                                } else {
                                    console.log(err);
                                    callback(500, { "Error": "Error deleting user" });
                                }
                            });
                        } else {
                            console.log(err);
                            callback(500, { "Error": "User you try to delete does not exist" });
                        }
                    });
                } else {
                    callback(404, { "Error": "Invalid token." });
                }
            });
        }
        else {
            callback(400, { "Error": "Token not provided in headers." });
        }
    } else {
        callback(404, { "Error": "mobileno not provided" });
    }
};

//tokens handlers.
handlers.tokens = function (data, callback) {
    var acceptedMethods = ['post', 'get', 'put', 'delete'];
    if (acceptedMethods.indexOf(data.Method) > -1) {
        handlers._tokens[data.Method](data, callback);
    } else {
        callback(405, { "Error": "Method not allowed." })
    }
};

//_tokens container.
handlers._tokens = {};

//_tokens post method handler.
handlers._tokens.post = async function (data, callback) {

    //Required fields : mobileno and password (to create token).
    var mobileno = typeof (data.Payload.mobileno) == 'string' && data.Payload.mobileno.trim().length == 10 ? data.Payload.mobileno.trim() : false;
    var password = typeof (data.Payload.password) == 'string' && data.Payload.password.trim().length > 2 ? data.Payload.password.trim() : false;

    try {
        
        if (mobileno && password) {
            var userdata = await userModel.findOne({ mobileno: mobileno })
            console.log(userdata.password);
            console.log(typeof (userdata));
            if (userdata.password == password) {
                try {
                    // creating random token and expiration limit.
                    var token = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var token = new tokenModel(
                        {
                            'mobileno': mobileno,
                            'token': token,
                            'expires': expires
                        }
                    );
                    //saving user token in db.
                    await token.save();
                    callback(200,token);
                    
                } catch (error) {
                    callback(500,{"Error" : "Server error c"});
                }

            } else {
                callback(400, { "Error": "password didnt match." });
            }

        } else {
            callback(400, { "Error": "Missing required fields (mobileno and password)." });
        }

    } catch (error) {
        callback(500,{"Error" : "Server error d"})
    }

};

//_tokens get method handler.
handlers._tokens.get = function (data, callback) {

    //Required fields : token.
    var token = typeof (data.QueryParams.token) == 'string' ? data.QueryParams.token : false;
    if (token) {
        //reading token object.
        _data.read('tokens', token, function (err, tokendata) {
            //converting tokendata to token object.
            var tokenobject = helpers.parseJsonToObject(tokendata);
            if (!err && tokenobject) {
                callback(200, tokenobject);
            } else {
                callback(404, { "Error": "tokenobject with this token not found." });
            }
        });
    } else {
        callback(404, { "Error": "Missing required fields." });
    }
};

//_tokens put method handler.
handlers._tokens.put = function (data, callback) {

    //Required fields : token,extendingTime.
    //user can only extend token expiration time nothing else can be changed.
    var token = typeof (data.Payload.token) == 'string' ? data.Payload.token : false;
    var extend = typeof (data.Payload.extend) == 'boolean' && data.Payload.extend == true ? true : false;

    if (token && extend) {

        //reading token object to update.
        _data.read('tokens', token, function (err, tokendata) {

            if (!err && tokendata) {

                //converting tokendata to object for updating.
                var tokenobj = helpers.parseJsonToObject(tokendata);

                //if token is not expired then only allow it to extend
                if (tokenobj.expires > Date.now()) {

                    //extending token expiration time for 1hr.
                    tokenobj.expires = Date.now() + 1000 * 60 * 60;

                    //update token expiration.
                    _data.update('tokens', token, tokenobj, function (err) {
                        if (!err) {
                            callback(200, tokenobj);
                        } else {
                            callback(500, { "Error": "Could not update token." });
                        }
                    });
                } else {
                    callback(500, { "Error": "token already expired." });
                }

            } else {
                callback(404, { "Error": "User with this token does not exist." });
            }
        });
    } else {
        callback(400, { "Error": "Missing required fields." });
    }
};

//_tokens delete method handler.
handlers._tokens.delete = function (data, callback) {

    //Required field : token.
    var token = typeof (data.QueryParams.token) == 'string' ? data.QueryParams.token : false;

    if (token) {

        //reading that token you try to delete exist or not.
        _data.read('tokens', token, function (err, tokendata) {
            if (!err && tokendata) {

                //deleting token data.
                _data.delete('tokens', token, function (err) {
                    if (!err) {
                        callback(200, { "Msg": "Token deleted successfully." });
                    } else {
                        callback(500, { "Error": "Could not delete token." });
                    }
                });
            } else {
                callback(404, { "Error": "Could not find tokendata." });
            }
        });
    } else {
        callback(404, { "Error": "Missing required fields." });
    }
};

//verify token handler.(if verified then only allow to do any operation.)
handlers.verifyToken = async function (token, mobileno, callback) {
    try {
        var tokendata = await tokenModel.findOne({ token : token });
        if (tokendata != null) {
            //verifying that token is associated with mobileno provided or not.
            if (tokendata.mobileno == mobileno && tokendata.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    } catch (error) {
        callback(false);
    }
    //reading data for authentication.
    _data.read('tokens', token, function (err, tokendata) {
    });
};

//checks handler.
handlers.checks = function (data, callback) {
    var acceptedMethods = ['post', 'get', 'put', 'delete'];
    if (acceptedMethods.indexOf(data.Method) > -1) {
        handlers._checks[data.Method](data, callback);
    } else {
        callback(404, { "Error": "Method not allowed" });
    }
};

//_checks handler.
handlers._checks = {};

//_checks  post handler.
handlers._checks.post = function (data, callback) {
    //Required fields : protocol,url,method,successCodes,timeoutSeconds.
    var protocols = ['http', 'https'];
    var protocol = typeof (data.Payload.protocol) == 'string' && protocols.indexOf(data.Payload.protocol) > -1 ? data.Payload.protocol : false;
    var url = typeof (data.Payload.url) == 'string' && data.Payload.url.trim().length > 3 ? data.Payload.url : false;
    var methods = ['post', 'get', 'put', 'delete'];
    var method = typeof (data.Payload.method) == 'string' && methods.indexOf(data.Payload.method) > -1 ? data.Payload.method : false;
    var successCodes = typeof (data.Payload.successCodes) == 'object' && data.Payload.successCodes instanceof Array && data.Payload.successCodes.length > 0 ? data.Payload.successCodes : false;
    var timeoutSeconds = typeof (data.Payload.timeoutSeconds) == 'number' && data.Payload.timeoutSeconds % 1 == 0 && data.Payload.timeoutSeconds > 0 && data.Payload.timeoutSeconds < 5 ? data.Payload.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {

        //getting token from headers to authenticate user.
        var token = typeof (data.Headers.token) == 'string' && data.Headers.token.trim().length == 20 ? data.Headers.token : false;

        if (token) {

            //reading phone number from token object using token.
            _data.read('tokens', token, function (err, tokendata) {

                if (!err && tokendata) {
                    //converting token data to token object.
                    var tokenObject = helpers.parseJsonToObject(tokendata);
                    var mobileno = tokenObject.mobileno;

                    //reading user using mobileno.
                    _data.read('users', mobileno, function (err, userdata) {


                        if (!err && userdata) {
                            //converting userdata to userobject.
                            var userobject = helpers.parseJsonToObject(userdata);
                            var usersChecks = typeof (userobject.checks) == 'object' && userobject.checks instanceof Array ? userobject.checks : [];

                            if (usersChecks.length < envConfig.maxchecks) {

                                var checkId = helpers.createRandomString(15);

                                var check = {
                                    'checkId': checkId,
                                    'mobileno': mobileno,
                                    'protocol': protocol,
                                    'url': url,
                                    'method': method,
                                    'successCodes': successCodes,
                                    'timeoutSeconds': timeoutSeconds
                                };

                                //creating and saving check object.
                                _data.create('checks', checkId, check, function (err) {
                                    if (!err) {
                                        //push check id to user object in checks array.
                                        userobject.checks = usersChecks;
                                        userobject.checks.push(checkId);
                                        //update userobject.
                                        _data.update('users', mobileno, userobject, function (err) {
                                            if (!err) {
                                                callback(200, check);
                                            } else {
                                                callback(500, { "Error": "Could not update user data with check created." });
                                            }
                                        });
                                    } else {
                                        console.log(err);
                                        callback(500, { "Error": "Could not create check." });
                                    }
                                });
                            } else {
                                callback(400, { "Error": "Check creation limit reached." });
                            }

                        } else {
                            callback(404, { "Error": "User associated with this token not found." });
                        }
                    });
                } else {
                    callback(404, { "Error": "User with this token not found." })
                }

            });
        } else {
            callback(400, { "Error": "Token not provided in headers." });
        }
    } else {
        callback(400, { "Error": "Missing required fields.(protocol or url or method or successCodes or timeoutSeconds)" });
    }

};

//_checks get method handler.
handlers._checks.get = function (data, callback) {

    //to access user checks mobile number and token is must.
    var checkId = typeof (data.QueryParams.checkId) == 'string' && data.QueryParams.checkId.trim().length == 15 ? data.QueryParams.checkId : false;
    if (checkId) {

        //reading check.
        _data.read('checks', checkId, function (err, checkdata) {
            if (!err && checkdata) {

                //converting checkdata to checkobject.
                var checkobj = helpers.parseJsonToObject(checkdata);
                //token to verify user.
                var token = typeof (data.Headers.token) == 'string' ? data.Headers.token : false;

                //verifiying token to know that authenticated user is requesting for check.
                handlers.verifyToken(token, checkobj.mobileno, function (validToken) {
                    if (validToken) {
                        callback(200, checkobj)
                    } else {
                        callback(403, { "Error": "Token is not created by you,you cannot access it." })
                    }
                });
            } else {
                callback(404, { "Error": "Check not found with this id." });
            }
        });
    } else {
        callback(400, { "Error": "Missing required fields.(checkId)" });
    }
};

//_checks put method handler.
handlers._checks.put = function (data, callback) {

    //Required fields : checkId.
    var checkId = typeof (data.QueryParams.checkId) == 'string' ? data.QueryParams.checkId : false;

    //fields you want to update atleast one should be specified.
    var protocols = ['http', 'https'];
    var protocol = typeof (data.Payload.protocol) == 'string' && protocols.indexOf(data.Payload.protocol) > -1 ? data.Payload.protocol : false;
    var url = typeof (data.Payload.url) == 'string' && data.Payload.url.trim().length > 3 ? data.Payload.url : false;
    var methods = ['post', 'get', 'put', 'delete'];
    var method = typeof (data.Payload.method) == 'string' && methods.indexOf(data.Payload.method) > -1 ? data.Payload.method : false;
    var successCodes = typeof (data.Payload.successCodes) == 'object' && data.Payload.successCodes instanceof Array && data.Payload.successCodes.length > 0 ? data.Payload.successCodes : false;
    var timeoutSeconds = typeof (data.Payload.timeoutSeconds) == 'number' && data.Payload.timeoutSeconds % 1 == 0 && data.Payload.timeoutSeconds > 0 && data.Payload.timeoutSeconds < 5 ? data.Payload.timeoutSeconds : false;

    if (checkId) {

        //reading check.
        _data.read('checks', checkId, function (err, checkdata) {
            if (!err && checkdata) {
                //converting checkdata to checkobject.
                var checkobj = helpers.parseJsonToObject(checkdata);
                //checking that fields to update is provided.
                if (protocol || url || method || successCodes || timeoutSeconds) {

                    //token to verify user.
                    var token = typeof (data.Headers.token) == 'string' ? data.Headers.token : false;

                    //verifiying token to know that authenticated user is requesting for check.
                    handlers.verifyToken(token, checkobj.mobileno, function (validToken) {
                        if (validToken) {

                            if (protocol) {
                                checkobj.protocol = protocol;
                            }
                            if (url) {
                                checkobj.url = url;
                            }
                            if (method) {
                                checkobj.method = method;
                            }
                            if (successCodes) {
                                checkobj.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkobj.timeoutSeconds = timeoutSeconds;
                            }
                            //update check data.
                            _data.update('checks', checkId, checkobj, function (err) {
                                if (!err) {
                                    callback(200, { "Error": "Checkdata updated successfully." });
                                } else {
                                    callback(500, { "Error": "Could not update check data." });
                                }
                            });
                        } else {
                            callback(403, { "Error": "Token verification failed." })
                        }
                    });
                } else {
                    callback(400, { "Error": "fields to update is not provided.(protocol or url or method or successCodes or timeoutSeconds)" });
                }
            } else {
                callback(404, { "Error": "Check with this id does not exist." });
            }
        });
    } else {
        callback(403, { "Error": "Missing required fields.(checkId)" });
    }
};

//_checks delete method handler.
handlers._checks.delete = function (data, callback) {
    //Required field to delete check : checkId
    var checkId = typeof (data.QueryParams.checkId) == 'string' && data.QueryParams.checkId.trim().length == 15 ? data.QueryParams.checkId : false;

    if (checkId) {

        //Checking that check you try to delete exist or not.
        _data.read('checks', checkId, function (err, checkdata) {
            if (!err && checkdata) {
                //converting checkdata to checkobject.
                var checkobj = helpers.parseJsonToObject(checkdata);
                //token to verify that user who created check is deleting check.
                var token = typeof (data.Headers.token) == 'string' && data.Headers.token.trim().length == 20 ? data.Headers.token : false;
                if (token) {
                    //verifying that token is of authenticated user.
                    handlers.verifyToken(token, checkobj.mobileno, function (validToken) {
                        if (validToken) {
                            //delete checkid from users checkarray.
                            _data.read('users', checkobj.mobileno, function (err, userdata) {
                                //converting userdata to userobj.
                                var userobj = helpers.parseJsonToObject(userdata);
                                var usersChecks = typeof (userobj.checks) == 'object' && userobj.checks instanceof Array ? userobj.checks : false;
                                //find posistion of check to delete.
                                var checkPos = usersChecks.indexOf(checkId);
                                if (checkPos > -1) {
                                    //removing checkid from checks array in userobject.
                                    usersChecks.splice(checkPos, 1);
                                    //update userobject.
                                    _data.update('users', userobj.mobileno, userobj, function (err) {
                                        if (!err) {
                                            //Deleting check.
                                            _data.delete('checks', checkId, function (err) {
                                                if (!err) {
                                                    callback(200, { "Msg": "Check deleted successfully" });
                                                } else {
                                                    console.log(err);
                                                    callback(500, { "Error": "Error deleting Check" });
                                                }
                                            });
                                        } else {
                                            callback(500, { "Error": "Could not update users checksArray." });
                                        }
                                    });
                                } else {
                                    callback(500, { "Error": "Check id not foound in users checks.(Internal error occured)" })
                                }
                            });
                        } else {
                            callback(404, { "Error": "Invalid token." });
                        }
                    });
                }
                else {
                    callback(400, { "Error": "Token not provided in headers." });
                }
            } else {
                console.log(err);
                callback(500, { "Error": "Check you try to delete does not exist" });
            }
        });
    } else {
        callback(404, { "Error": "Missing required fields.(chekcId)" });
    }
};

//notfound handler.
handlers.notFound = function (data, callback) {
    callback(404, { "Error": "not found" });
};

//Exporting handlers.
module.exports = handlers;

