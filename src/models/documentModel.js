const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({

    slug: {
        type: String,
        unique: true
    },

    title: String,

    content: String,

    version: {
        type: Number,
        default: 1
    },

    tags: [String],

    metadata: {

        author: {

            id: String,

            name: String,

            email: String
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        updatedAt: {
            type: Date,
            default: Date.now
        },

        wordCount: Number
    },

    revision_history: []
});



// TEXT INDEX

documentSchema.index({

    title: "text",

    content: "text"
});



module.exports = mongoose.model("Document", documentSchema);