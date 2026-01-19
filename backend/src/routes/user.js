import express from "express"
const userRoutes = express.Router()

userRoutes.get("/", (req, res) => {
    // TODO: Bussiness Logic, Controller
    res.status(200).json({ message: "Hello User!" })
})

export default userRoutes
