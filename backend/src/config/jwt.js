const jwtConfig = {
	secret: process.env.JWT_SECRET,
	accessExpiresIn: "1h",
	refreshExpiresIn: "7d",
}

export default jwtConfig
