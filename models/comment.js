// models/comment.js

const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog", // Creates a reference to the Blog model
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user", // Creates a reference to the User model
    },
}, { timestamps: true });

const Comment = model("comment", commentSchema);

module.exports = Comment;