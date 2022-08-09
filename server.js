const express = require("express")
const app = express()

app.set("view engine", "ejs")

//setup route to render homepage
app.get("/", (req, res) => {
    res.render("index")
})

//listen on port 3000
app.listen(3000)