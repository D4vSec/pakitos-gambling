module.exports = {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: "1h",
    refreshExpiresIn: "7d",
}
