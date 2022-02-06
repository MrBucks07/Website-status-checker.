/**
 * Creating logs schema.
 */

//required dependency.
const mongoose = require('mongoose');

//creating log schema.
const logSchema = new mongoose.Schema(
    {
        check : {
            required: true,
            type: Object
        },
        checkOutcome : {
            required: true,
            type: Object
        },
        state : {
            required: true,
            type: String
        },
        alertWanted : {
            required: true,
            type: Boolean
        },
        timeOfCheck : {
            required: true,
            type: Number
        }
    }
);

//creating log model from log schema.
var logModel = mongoose.model('LOG',logSchema);

//exporting module.
module.exports = logModel;