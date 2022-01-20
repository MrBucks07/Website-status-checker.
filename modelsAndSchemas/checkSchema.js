/**
 * Creating user schema and model.
 */

//required dependency.
const mongoose = require('mongoose');

//creating user schema using mongoose.
const checkSchema = new mongoose.Schema(
    {
        checkId : {
            type : String,
            required : true
        },
        mobileno : {
            type : String,
            require : true
        },
        protocol : {
            type : String,
            require : true
        },
        url : {
            type : String,
            require : true
        },
        method : {
            type : String,
            require : true
        },
        successCodes : {
            type : Array,
            require : true
        },
        timeoutSeconds : {
            type : Number,
            require : true
        }
    }
);

//creating model using schema.
const checkModel = mongoose.model("CHECK",checkSchema);

//exporting userModel.
module.exports = checkModel;