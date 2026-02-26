const adminMiddleware = (req, res, next) => {
	if (!req.user || req.user.role !== "admin") {
		return res.status(403).json({ code: "NO_PERMISSION", message: "Forbidden" })
	}
	next()
}

export default adminMiddleware
