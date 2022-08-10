require("dotenv").config()
const multer = require("multer")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const File = require("./models/File")


//APPLICATION
const express = require("express")
const app = express()

//allows express to understatnd form from html form tag
app.use(express.urlencoded({ extended: true}))

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
//the upload.single gives you file with properties, body gives you inputs from form.
//the bcrypt.hash 10 is the password salt, ensures even same passwords are hashed differently
app.post("/upload", upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
    }
    if (req.body.password != null && req.body.password !== "") {
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }

    const file = await File.create(fileData)
    
    //creates new url link from this file id from our domain(headers.origin)
    res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}`})
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
    const file = await File.findById(req.params.id)

    if(file.password != null) {
        if (req.body.password == null) {
            res.render("password")
            return
        }
        if (!(await bcrypt.compare(req.body.password, file.password))){
            res.render("password", { error: true })
            return
        }
    }

    file.downloadCount++
    await file.save()

    res.download(file.path, file.originalName)
}

//listen on port
app.listen(process.env.PORT)