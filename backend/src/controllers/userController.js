import User from "#models/userModel"
import * as z from "zod"
import { hashPassword } from "#utils/password"

const getProfile = async (req, res) => {
	try {
		const user = await User.findUserById(req.user.id)

		if (!user)
			return res.status(404).json({ code: "USER_NOT_FOUND", message: "User not found" })

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

const deleteSelf = async (req, res) => {
	try {
		const userId = req.user.id
		const deleted = await User.deleteUser(userId)

		if (!deleted)
			return res
				.status(404)
				.json({ code: "USER_NOT_FOUND", message: "User not found or already deleted" })

		res.status(204).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: "Server error" })
	}
}

const updateSelf = async (req, res) => {
	try {
		const userId = req.user.id

		const schema = z
			.object({
				username: z.string().min(3).max(50).optional(),
				email: z.string().email().optional(),
				password: z.string().min(8).optional(),
			})
			.strict()

		const data = schema.parse(req.body)

		if (data.password) {
			data.password = await hashPassword(data.password)
		}

		const updated = await User.updateUser(userId, data)

		if (!updated)
			return res
				.status(404)
				.json({ code: "USER_NOT_FOUND", message: "User not found or update failed" })

		res.status(200).json({ message: "success" })
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ errors: err.errors })
		}
		console.error(err)
		res.status(500).json({ message: "Server error" })
	}
}

const getUserById = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findUserById(id)

		if (!user)
			return res.status(404).json({ code: "USER_NOT_FOUND", message: "User not found" })

		res.json({ id: user.id, username: user.username, email: user.email, role: user.role })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: "Server error" })
	}
}

const updateUserById = async (req, res) => {
	try {
		const { id } = req.params

		const schema = z
			.object({
				username: z.string().min(3).max(50).optional(),
				email: z.string().email().optional(),
				password: z.string().min(8).optional(),
				role: z.enum(["user", "admin"]).optional(),
			})
			.strict()

		const data = schema.parse(req.body)

		if (data.password) {
			data.password = await hashPassword(data.password)
		}

		const updated = await User.updateUser(id, data)

		if (!updated)
			return res
				.status(404)
				.json({ code: "USER_NOT_FOUND", message: "User not found or update failed" })

		res.status(200).json({ message: "success" })
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ errors: err.errors })
		}
		console.error(err)
		res.status(500).json({ message: "Server error" })
	}
}

const deleteUserById = async (req, res) => {
	try {
		const { id } = req.params
		const deleted = await User.deleteUser(id)

		if (!deleted)
			return res
				.status(404)
				.json({ code: "USER_NOT_FOUND", message: "User not found or already deleted" })

		res.status(204).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: "Server error" })
	}
}

export {
	getProfile,
	getAllUsers,
	deleteSelf,
	updateSelf,
	getUserById,
	updateUserById,
	deleteUserById,
}
