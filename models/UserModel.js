const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserDataSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        email: { type: String, required: true },
        name: String,
        password: String,             
    });
var UserData = mongoose.model('UserData', UserDataSchema,'users');
module.exports = UserData;