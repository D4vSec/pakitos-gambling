import argon2 from "argon2"

const hashPassword = async (password) => {
	return await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 2 ** 16,
		timeCost: 3,
		parallelism: 1,
	})
}

const comparePassword = async (hash, password) => {
	return await argon2.verify(hash, password)
}

export { hashPassword, comparePassword }
