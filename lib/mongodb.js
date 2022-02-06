/**
 * MongoDB database related codes.
 */

//required dependency.
const env = require("dotenv");
env.config();
const mongoose = require('mongoose');

//atlas connection url.
const url = process.env.DBURL;

//container for all function.
var db = {};

//connecting to db.
db.connect = async function(){
    try {
        //connecting to mongodb.
        await mongoose.connect(url);
        console.log("\x1b[32m%s\x1b[0m","Connected to MongoDb...");
    } catch (error) {
        console.log("\x1b[31m%s\x1b[0m","Error");
        console.log("\x1b[31m%s\x1b[0m",error);
    }
}
//db init function.
db.init = function(){
    //connect to db function.
    db.connect();
}

//exporting db module.
module.exports = db;
