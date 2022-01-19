/**
 * Creating session token schema and model.
 */

//required dependency.
const mongoose = require('mongoose');

//creating user schema using mongoose.
const tokenSchema = new mongoose.Schema(
    {
        mobileno : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        },
        expires : {
            type : Number,
            required : true
        }
    }
);

//creating model using schema.
const tokenModel = mongoose.model("TOKEN",tokenSchema);

//exporting userModel.
module.exports = tokenModel;