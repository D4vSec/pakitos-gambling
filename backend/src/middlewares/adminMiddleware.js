const adminMiddleware = (req, res, next) => {
	if (!req.user || req.user.role !== "admin") {
		return res.status(403).json({ code: "NO_PERMISSION" })
	}
	next()
}

export default adminMiddleware
