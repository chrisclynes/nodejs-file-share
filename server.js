const multer = require("multer")
const mongoose = require("mongoose")
const express = require("express")
const app = express()

//set upload file path with multer
//when called, this will create a folder in root called upload with the file
//file will have a random generated name, no file name conflicts
const upload = multer({ dest: "uploads"})

mongoose.connect(process.env.DATABASE_URL)

//setup link to styles
app.use("/public", express.static('public'));

app.set("view engine", "ejs")

//setup route to render homepage
app.get("/", (req, res) => {
    res.render("index")
})

//on submit, before the request have multer stage the file for upload, takes file from form submit
app.post("/upload", upload.single("file") (req, res) => {
    res.send("file sent")
})

//listen on port 3000
app.listen(process.env.PORT)