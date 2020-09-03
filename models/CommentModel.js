const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentDataSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        comment: String,
        email: String,     
    });
var CommentData = mongoose.model('CommentData', CommentDataSchema,'comments');
module.exports = CommentData;