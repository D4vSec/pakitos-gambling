const jwtConfig = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    accessExpiresIn: "1h",
    refreshExpiresIn: "7d",
}

export default jwtConfig
