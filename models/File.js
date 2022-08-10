const mongoose = require('mongoose')

//create schema file 
const File = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    password: String,
    downloadCount: {
        type: Number,
        required: true,
        default: 0
    }
})

//creates a table called File which uses the File schema
module.exports = mongoose.model("File", File)