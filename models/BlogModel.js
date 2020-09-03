const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const CommentData = require('./CommentModel');
var BlogDataSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        title: { type: String, required: true },
        author: String,
        date: String,
        sdesc: String,
        ldesc: String,    
        email: String,
        file: [
            {
                type: String,
            }
        ],
        comment: [
            {
                type: Schema.Types.ObjectId,
                ref: 'CommentData',
            }
        ]         
    });
var BlogData = mongoose.model('BlogData', BlogDataSchema,'blogs');
module.exports = BlogData;