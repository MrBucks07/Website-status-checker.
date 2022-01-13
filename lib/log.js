/**
 * Log file for processing and storing Check Outcomes.
 */

//required dependencies.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

//lib container for functions.
var lib = {};

//base directory.
lib.baseDir = path.join(__dirname,'/../.logs/');

//append function for appending logs.
lib.append = function(dirname,data,callback){
    fs.open(lib.baseDir+dirname+'.log','a',function(err,fileDescriptor){
        if (!err && fileDescriptor) {
            fs.appendFile(fileDescriptor,data+'\n',function(err){
                if (!err) {
                    fs.close(fileDescriptor,function(err){
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Could not close the file after appending.");
                        }
                    });
                } else {
                    callback("Could not append the file.");
                }
            });
        } else {
            callback("Could not open the file.");
        }
    });
};

//listing all logs.
lib.list = function(includeCompressed,callback){
    fs.readdir(lib.baseDir,function(err,data){
        if (!err && data && data.length > 0) {
            var trimmedfilenames = [];
            data.forEach(function(filename){
                //adding trimmed log id to array.
                if(filename.indexOf('.log') > -1){
                    trimmedfilenames.push(filename.replace('.log',''));
                }

                //adding compressed file if specified.
                if(filename.indexOf('.gz.b64') > -1 && includeCompressed){
                    trimmedfilenames.push(filename.replace('.gz.b64',''));
                }
            });
            callback(false,trimmedfilenames); 
        } else {
            callback(err,data);
        }
    });
};

//compressing listed logs.
lib.compress = function(fileId,newFileId,callback){
    var sourcefile = fileId+'.log';
    var destFile = newFileId+'.gz.b64';

    //opening file in utf8 format.
    fs.readFile(lib.baseDir+sourcefile,'utf8',function(err,inputString){
        if (!err && inputString) {
            zlib.gzip(inputString,function(err,buffer){
                if (!err && buffer) {
                    fs.open(lib.baseDir+destFile,'wx',function(err,fileDescriptor){
                        if (!err && fileDescriptor) {
                            fs.write(fileDescriptor,buffer.toString('base64'),function(err){
                                if (!err) {
                                    fs.close(fileDescriptor,function(err){
                                        if (!err) {
                                            callback(false);
                                        } else {
                                            callback("Error closing file.");
                                        }
                                    });
                                } else {
                                    callback("Error writing file.");
                                }
                            });
                        } else {
                            callback("Error opening file.");
                        }
                    });
                } else {
                    callback("Error unzipping file.");
                }
            });
        } else {
            callback("Error opening file.");
        }
    });
};

//truncating logs after compressing.
lib.truncate = function(logId,callback){
    fs.truncate(lib.baseDir+logId+'.log',0,function(err){
        if (!err) {
            callback(false);
        } else {
            console.log(err);
        }
    });
};

//exporting lib.
module.exports = lib;