const jwtConfig = {
	secret: process.env.JWT_SECRET,
	refreshSecret: process.env.REFRESH_SECRET,
	accessExpiresIn: "3m",
	refreshExpiresIn: "60d",
}

export default jwtConfig
