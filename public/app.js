/**
 * Javascript logic for public.
 */

//const helpers = require("../lib/helpers");

//empty app object.
var app = {};
var check = false;

//checking that token is provided.
app.config = {
    "sessionToken": false
};

//AJAX client for restfull api.
app.client = {};

//creating AJAX request body.
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {

    //checking parameters.
    headers = typeof (headers) == "object" && headers !== null ? headers : {};
    path = typeof (path) == "string" ? path : '';
    method = typeof (method) == "string" && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == "object" && queryStringObject !== null ? queryStringObject : {};
    payload = typeof (payload) == "object" && payload !== null ? payload : {};
    callback = typeof (callback) == "function" ? callback : false

    //query string parameter concating.
    var requestUrl = path + '?';
    var counter = 0;

    for (var querykey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(querykey)) {
            counter++;

            if (counter > 1) {
                requestUrl += '&';
            }

            requestUrl += querykey + '=' + queryStringObject[querykey];
        }
    };

    //making new instance of http req of json type;
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    //adding extra headers sent by user.
    for (var headerkey in headers) {
        if (headers.hasOwnProperty(headerkey)) {
            xhr.setRequestHeader(headerkey, headers[headerkey]);
        }
    };

    //checking session token.
    if (app.config.sessionToken) {
        xhr.setRequestHeader("token", app.config.sessionToken.token);
    }

    //when response comes.
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var statuscode = xhr.status;
            var responseReturned = xhr.responseText;

            // callback
            if (callback) {
                try {
                    var parsedResponse = JSON.parse(responseReturned);
                    callback(statuscode, parsedResponse);
                } catch (e) {
                    console.log(e);
                    callback(statuscode, false);
                }
            }
        }
    };
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
};


//binding form inputs.
app.bindForm = function () {
    //checking that form is present on screen.
    if (document.querySelector("form")) {
        document.querySelector("form").addEventListener("submit", function (e) {
            //prevent form from submiting.
            e.preventDefault();
            //getting some required fields.
            var formId = this.id;
            var action = this.action;
            var method = this.method;

            //hiding form error occured previously.
            document.querySelector(".formWrapper .formError").style.display = 'none';

            //creating payload.
            var payload = {};
            var elements = this.elements;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type !== "submit") {
                    if (elements[i].classList.value.indexOf("multiselect") > -1 && elements[i].type == "checkbox") {
                        if (elements[i].checked) {
                            payload[elements[i].name] = typeof(payload[elements[i].name]) == 'object' && payload[elements[i].name] instanceof Array ? payload[elements[i].name] : [];
                            payload[elements[i].name].push(elements[i].value);
                        }
                    } else {
                        if (elements[i].classList.value == "timeout") {
                            var timeoutSeconds = Number(elements[i].value);
                            payload[elements[i].name] = timeoutSeconds;
                        } else {
                            payload[elements[i].name] = elements[i].value;
                        }
                    }
                }
            };

            var queryStringObject = undefined;
            //method manipulation according to form used.
            if (formId == "accountCreate" || formId == "sessionCreate" || formId == "createCheck") {
                method = "POST"
            }
            if (formId == "accountEdit") {
                method = "PUT"
            }
            if (formId == "editCheck") {
                method = "PUT"
                var checkId = typeof(window.location.href.split("=")[1]) == 'string' && window.location.href.split("=")[1].length > 0 ? window.location.href.split("=")[1] : false;
                if (checkId) {
                    queryStringObject = {
                        "checkId" : checkId
                    };
                }
            }

            //calling api.
            app.client.request(undefined, action, method, queryStringObject, payload, function (statusCode, resPayload) {
                //checking type of error.
                var error = typeof (resPayload.Error) == 'string' ? resPayload.Error : "An unknown error occured.";
                if (statusCode == 200) {
                    //calling for response processor.
                    app.formResponseProcessor(formId, payload, resPayload);
                } else {
                    if (statusCode == 403) {
                        //as token is invalid or expired logging out user.
                        app.logoutOutUser();
                    } else {
                        //showing error.
                        document.querySelector(".formWrapper .formError").innerHTML = error;
                        //unhiding form error.
                        document.querySelector(".formWrapper .formError").style.display = 'block';
                        check = true;
                        console.log(statusCode, error);
                    }
                }
            });
        });
    };
};

//form response processor for processing response.
app.formResponseProcessor = function (formId, payload, resPayload) {
    //if account is created successfully create session token.
    if (formId == "accountCreate") {
        //creating new payload to create token.
        var newPayload = {
            'mobileno': payload.mobileno,
            'password': payload.password
        };
        //calling tokens api.
        app.client.request(undefined, "/api/tokens", "POST", undefined, newPayload, function (statusCode, newResPayload) {
            if (statusCode == 200) {
                //set session token and redirect to dashboad.
                //here res payload means we are passing token.
                app.setSessionToken(newResPayload);
                window.location = '/checks/all';
            } else {
                console.log(statusCode, resPayload);
            }
        });
    }
    //if user is logged in successfully.
    if (formId == "sessionCreate") {
        //set sesssion token and redirect to dashboard.
        //here res payload means we are passing token.
        app.setSessionToken(resPayload);
        window.location = '/checks/all';
    }
    //if user updated successfully.
    if (formId == "accountEdit") {
        //showing success message.
        document.querySelector(".formWrapper .formError").innerHTML = "Account Data updated successfully.";
        //changing background color of message.
        document.querySelector(".formWrapper .formError").style.color = "green";
        //unhiding form error.
        document.querySelector(".formWrapper .formError").style.display = 'block';
        check = true;
        //empty password field after data updated successfully.
        document.querySelector("#accountEdit input.passwordInput").value = null;
    }
    //if user check created successfully.
    if (formId == "createCheck") {
        window.location = '/checks/all';
    }
    //if user check updated successfully.
    if (formId == "editCheck") {
        //showing success message.
        document.querySelector(".formWrapper .formError").innerHTML = "Check Data updated successfully.";
        //changing background color of message.
        document.querySelector(".formWrapper .formError").style.color = "green";
        //unhiding form error.
        document.querySelector(".formWrapper .formError").style.display = 'block';
        check = true;
    }
}

//setting loggedIn class in body.
app.setLoggedIn = function (setClass) {
    var body = document.querySelector("body");
    if (setClass) {
        body.classList.add("isloggedin");
    } else {
        body.classList.add("isloggedout");
    }
};

//setting session token in localstorage.
app.setSessionToken = function (token) {
    console.log(token);
    //setting token in app.config and in local storage.
    app.config.sessionToken = token;
    var tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    if (typeof (token) == 'object') {
        app.setLoggedIn(true);
    } else {
        app.setLoggedIn(false);
    }
};

//get session token from local storage.
app.getSessionToken = function () {
    var tokenString = localStorage.getItem("token");
    if (typeof (tokenString) == "string") {
        try {
            var token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if (typeof (token) == "object") {
                app.setLoggedIn(true);
            } else {
                app.setLoggedIn(false);
            }
        } catch (error) {
            console.log(error);
            app.config.sessionToken = false;
            app.setLoggedIn(false);
        }
    }
};

//binding logout button.
app.bindButton = function () {
    var bodyClass = document.querySelector("body").classList;
    if (bodyClass[0] == "editAccount") {
        document.getElementById("deleteAccountBtn").addEventListener("click", function (e) {
            //prevent default action.
            e.preventDefault();
            //calling delete account function.
            app.deleteAccount();
        });
    } 
    if (bodyClass[0] == "dashboard") {
        document.getElementById("createCheckButton").addEventListener("click", function (e) {
            //prevent default action.
            e.preventDefault();
            //calling delete account function.
            window.location = '/check/create'
        });
    }
    if (bodyClass[0] == "editCheck") {
        document.getElementById("deleteCheckBtn").addEventListener("click", function(e){
            //prevent dafault action.
            e.preventDefault();
            //calling check delete function.
            app.deleteCheck();
        });
    }
    
    document.getElementById("logoutButton").addEventListener("click", function (e) {
        //prevent default action.
        e.preventDefault();
        //calling logout function.
        app.logoutOutUser();
    });
};

//logout user form account.
app.logoutOutUser = function () {
    var token = typeof (app.config.sessionToken.token) == 'string' ? app.config.sessionToken.token : '';
    var queryStringObject = {
        'token': token
    };
    //making delete request to api/tokens.
    app.client.request(undefined, "/api/tokens", "DELETE", queryStringObject, undefined, function (statusCode, resPayload) {
        if (statusCode == 200) {
            app.setSessionToken(false);
            window.location = '/session/deleted';
        }
    });
};

//delete user account.
app.deleteAccount = function(){
    var mobileno = typeof(app.config.sessionToken.mobileno) == 'string' ? app.config.sessionToken.mobileno : '';
    var queryStringObject = {
        'mobileno' : mobileno
    };
    //making delete account request to api/users.
    app.client.request(undefined,"/api/users", "DELETE", queryStringObject, undefined, function(statusCode, resPayload){
        if (statusCode == 200) {
            app.setSessionToken(false);
            window.location = '/account/deleted';
        } else {
            console.log(resPayload);
        }
    });
};

//function to delete check.
app.deleteCheck = function(){
    //getting check id from url bar.
    var checkId = typeof(window.location.href.split("=")[1]) == 'string' && window.location.href.split("=")[1].length > 0 ? window.location.href.split("=")[1] : false;
    if (checkId) {
        //creating query string object.
        var queryStringObject = {
            'checkId' : checkId
        };
        //calling api/checks with delete request.
        app.client.request(undefined, "/api/checks", "DELETE", queryStringObject, undefined, function(statusCode, resPayload){
            if (statusCode == 200) {
                //redirecting user to dashboard.
                window.location = '/checks/all';
            } else {
                console.log("Error deleting check.");
            }
        });
    } else {
        
    }

};


//renew token.
app.renewToken = function (callback) {

    //checking token in app.config.
    var currentToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    console.log(typeof (currentToken));

    if (currentToken) {
        //updating token.
        var payload = {
            'token': app.config.sessionToken.token,
            'extend': true
        };
        //request to update token.
        app.client.request(undefined, "/api/tokens", "PUT", undefined, payload, function (statusCode, resPayload) {
            if (statusCode == 200) {
                //passing tokenId in url (query string).
                var queryStringObject = {
                    'token': app.config.sessionToken.token
                };
                //making request to get token from db.
                app.client.request(undefined, "/api/tokens", "GET", queryStringObject, undefined, function (statusCode, resPayload) {
                    if (statusCode == 200) {
                        //setting session token in local storage.
                        app.setSessionToken(resPayload);
                        callback(true);
                    } else {
                        app.setSessionToken(false);
                        callback(false);
                    }
                });
            } else {
                console.log(statusCode, false);
                callback(false);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(false);
    }
};

//checking that class on page is editAccount.
app.loadDataOnPage = function () {
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof (bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

    if (primaryClass == "editAccount") {
        //load user data on edit account page.
        app.loadEditAccountPage();
    }
    if (primaryClass == "dashboard") {
        //load checks created by user.
        app.checksList();
    }
    if (primaryClass == "editCheck") {
        //load previously created check to edit.
        app.loadCheckToEdit();
    }
};

//loading user data on account edit page.
app.loadEditAccountPage = function () {
    //getting mobile no from app.config
    var mobileno = typeof (app.config.sessionToken.mobileno) == 'string' ? app.config.sessionToken.mobileno : false;
    if (mobileno) {
        //sending mobileno in url.
        var queryStringObject = {
            'mobileno': mobileno
        };
        //calling api
        app.client.request(undefined, "/api/users", "GET", queryStringObject, undefined, function (statusCode, resPayload) {
            if (statusCode == 200) {
                //loading input field on html page with real data.
                document.querySelector("#accountEdit .mobilenoInput").value = resPayload.mobileno;
                document.querySelector("#accountEdit .fullnameInput").value = resPayload.fullname;
                document.querySelector("#accountEdit .usernameInput").value = resPayload.username;
            } else {
                //logout user assuming api is down.
                app.logoutOutUser();
            }
        });
    } else {
        //logout user assuming that session expired.
        app.logoutOutUser();
    }
};


//load all checks created by user.
app.checksList = function(){
    //gettting mobile no from app.config.sessionToken.
    var mobileno = typeof(app.config.sessionToken.mobileno) == 'string' ? app.config.sessionToken.mobileno : false;
    if (mobileno) {
        //creating request to api/users for checks ids.
        var queryStringObject = {
            'mobileno' : mobileno
        };
        //calling api/users.
        app.client.request(undefined,"/api/users","GET",queryStringObject,undefined,function(statusCode,resPayload){
            if (statusCode == 200) {
                //if checks were there.
                document.getElementById("noChecksMessage").style.display = "none";
                var checkIds = typeof(resPayload.checks) == 'object' && resPayload.checks instanceof Array && resPayload.checks.length > 0 ? resPayload.checks : [];
                if (checkIds.length > 0) {
                    
                    //if check Ids were there loop and fetch checks.
                    checkIds.forEach(function(checkId){
                        //creating request to api/checks using checkId.
                        var queryStringObject = {
                            'checkId' : checkId
                        };
                        //calling api/checks.
                        app.client.request(undefined,"/api/checks","GET",queryStringObject,undefined,function(statusCode,resPayload){
                            if (statusCode == 200) {
                                //selecting table.
                                var table = document.getElementById("checksListTable");
                                //appending row at bottom (thats why -1).
                                var tr = table.insertRow(-1);
                                tr.classList.add("checkRow");
                                /*putting checks data in checkrow > incells.
                                1. protocol
                                2. method
                                3. url
                                4. state
                                5. option to edit or delete.
                                */
                                tr.insertCell(0).innerHTML = resPayload.protocol;
                                tr.insertCell(1).innerHTML = resPayload.method;
                                tr.insertCell(2).innerHTML = resPayload.url;
                                var statecheck = typeof(resPayload.state) == 'string' ? resPayload.state : "unknown";
                                tr.insertCell(3).innerHTML = statecheck;
                                tr.insertCell(4).innerHTML = '<a href="check/edit?checkId='+resPayload.checkId+'">view / edit / delete</a>';
                            } else {
                                console.log("Error loading check wit Id : ",checkId);
                            }
                        });
                    });
                    //if checks is five hide create check button.
                    if (checkIds.length == 5) {
                        document.getElementById("createCheckButton").style.display = 'none';
                    }
                } else {
                    //if check is not there.
                    document.getElementById("noChecksMessage").style.display = "table-row";
                }
            } else {
                //logging out user assuming that session expired.
                app.logoutOutUser();
            }
        });
    } else {
        //logout user.
        app.logoutOutUser();
    }
}

//load checks which user want to edit.
app.loadCheckToEdit = function(){

    //getting check id form url.
    var checkId = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split("=")[1].length > 0 ? window.location.href.split("=")[1] : false;
    if (checkId) {

        //fetching check data using check Id.
        var queryStringObject = {
            'checkId' : checkId
        };
        //calling api/checks.
        app.client.request(undefined,"/api/checks","GET",queryStringObject,undefined,function(statusCode,resPayload){
            if (statusCode == 200) {
                
                /*putting data in fields
                1. checkId
                2. state
                3. protocol
                4. url
                5. method
                6. statusCodes
                7. timeoutseconds
                */
               document.querySelector("#editCheck .displayCheckId").value = resPayload.checkId;
               var statecheck = typeof(resPayload.state) == 'string' ? resPayload.state : "unknown";
               document.querySelector("#editCheck .displayCheckState").value = statecheck;
               document.querySelector("#editCheck .editCheckProtocol").value = resPayload.protocol;
               document.querySelector("#editCheck .editCheckUrl").value = resPayload.url;
               document.querySelector("#editCheck .editCheckMethod").value = resPayload.method;
               document.querySelector("#editCheck .editCheckTimeout").value = resPayload.timeoutSeconds;
               var successCodesChecked = document.querySelectorAll("#editCheck input.multiselect");
            //    successCodesChecked.forEach(function(){
                
            //    });
               for(var i=0; i<successCodesChecked.length; i++) {
                if (resPayload.successCodes.indexOf(successCodesChecked[i].value) > -1) {
                    successCodesChecked[i].checked = true;
                   }
                }

            } else {
                //redirecting back to dashboard if status Code is not 200.
                window.location = '/checks/all';
            }
        });
    } else {
        //redirecting back to dashboard if check id is empty in url.
        window.location = '/checks/all';
    }
};


//token renewal loop.
app.tokenRenewalLoop = function () {
    setInterval(function () {
        //calling token renew function.
        app.renewToken(function (renewed) {
            if (renewed) {
                console.log("\x1b[32m%s\x1b[0m", "Token renewed successfully");
            } else {
                console.log("Unable to renew token.");
            }
        });
    }, 1000 * 60 * 58);
};



//calling required function in init function.
app.init = function () {
    //binding account create page.
    app.bindForm();
    //getting session token from local storage.
    app.getSessionToken();
    //binding button.
    app.bindButton();
    //renewing token every 1 hour.
    app.tokenRenewalLoop();
    //loading data on edit account page.
    app.loadDataOnPage();
};

//window onload function.
window.onload = function () {
    //calling init function on every window onload.
    app.init();
};

//continously checking error msg on screen.
setInterval(() => {
    if (check) {
        hideMessages();
    }
}, 1000);

//function to hide error msg.
function hideMessages(){
    check = false;
    setTimeout(() => {
        document.querySelector(".formWrapper .formError").style.display = "none";
    }, 5000);
};


