const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    // TODO: Bussiness Logic, Controller
    res.status(200).json({ message: "Hello User!" })
})

module.exports = router
