const express = require("express")
const app = express()
const cors = require("@config/cors")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/", (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

module.exports = app
