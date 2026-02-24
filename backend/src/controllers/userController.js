import User from "#models/userModel"

const getProfile = async (req, res) => {
    try {
        const user = await User.findUserById(req.user.id)

        if (!user) return res.status(404).json({ message: "User not found" })

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAllUsers()
        res.json(users || [])
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export { getProfile, getAllUsers }
