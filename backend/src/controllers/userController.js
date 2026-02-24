import db from "#config/db"

const getProfile = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT username, email FROM users WHERE id = ?", [req.user.id])

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json(rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, username, email FROM users")

        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export { getProfile, getAllUsers }
