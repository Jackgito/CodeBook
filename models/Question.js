const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    title: {
        type: "String",
        required: true
    },
    question: {
        type: "String",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: false
    },
    votes: {
        type: Number,
        required: false
    }, 
    views: {
        type: Number,
        required: false
    },
    tags: {
        type: ["String"],
        required: false
    },
    author: {
        type: "String",
        required: false
    },
    url: {
        type: "String",
        required: true    
    },
    comments: {
        type: ["String"],
        required: false   
    }
})

module.exports = mongoose.model("Question", questionSchema)