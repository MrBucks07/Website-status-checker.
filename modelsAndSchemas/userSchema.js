/**
 * Creating user schema and model.
 */

//required dependency.
const mongoose = require('mongoose');

//creating user schema using mongoose.
const userSchema = new mongoose.Schema(
    {
        fullname : {
            type : String,
            required : true
        },
        username : {
            type : String,
            required : true
        },
        mobileno : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        }
    }
);

//creating model using schema.
const userModel = mongoose.model("USER",userSchema);

//exporting userModel.
module.exports = userModel;