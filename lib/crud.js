/**
 * All crud operation logic.
 */

const fs = require('fs');
const path = require('path');

//Container for cruds.
var lib = {};

//base dir.
lib.baseDir = path.join(__dirname,'/../.data/');

//create operation.
lib.create = function(dir,fileName,data,callback){
    fs.open(lib.baseDir+dir+"/"+fileName+'.json','wx',function(err,fileDescriptor){
        if (!err && fileDescriptor) {
            //Cannot store data in object form, so converting it to string.
            var stringData = JSON.stringify(data);

            fs.write(fileDescriptor,stringData,function(err){
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
            callback("Could not create file ! It may already exist.");
        }
    });
};

//read data.
lib.read = function(dir,fileName,callback){
    fs.readFile(lib.baseDir+dir+"/"+fileName+'.json','utf8',function(err,data){
        callback(err,data)
    });
};

//update data.
lib.update = function(dir,fileName,data,callback){
    
    //opening file to update data.
    fs.open(lib.baseDir+dir+"/"+fileName+'.json','r+',function(err,fileDescriptor){
        
        if (!err && fileDescriptor) {
            
            var updatingData = JSON.stringify(data);
            
            //replacing data if already there or updating.
            fs.ftruncate(fileDescriptor,function(err){
                if (err) {
                    callback("Error truncating file.");
                    console.log(err);
                } else {

                    //writing updated data string.
                    fs.writeFile(fileDescriptor,updatingData,function(err){
                        if (err) {
                            console.log(err);
                            callback("Error writing file.")
                        } else {

                            //closing file after updating.
                            fs.close(fileDescriptor,function(err){
                                if (err) {
                                    callback("Error closing file");
                                    console.log(err);
                                } else {
                                    callback(false);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            callback("Error opening file.");
        }
    });
};

lib.delete = function(dir,fileName,callback){
    fs.unlink(lib.baseDir+dir+"/"+fileName+'.json',function(err){
        if (err) {
            callback("Error deleting file.");
        } else {
            callback(false);
        }
    });
};

lib.list = function(dir,callback){
    fs.readdir(lib.baseDir+'/'+dir,function(err,data){
        if (!err && data && data.length > 0) {
            var fileNames = [];
            data.forEach(function(fileName){
                fileNames.push(fileName.replace('.json',''));
            });
            callback(false,fileNames);
        } else {
            callback(err,data);
        }
    });
};

//Exporting lib.
module.exports = lib;