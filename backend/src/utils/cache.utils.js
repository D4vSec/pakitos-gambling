const createCache = () => {
	const entries = new Map()
	const timers = new Map()

	const clearTimer = (key) => {
		const timer = timers.get(key)
		if (timer !== undefined) {
			clearTimeout(timer)
			timers.delete(key)
		}
	}

	const expireEntry = (key) => {
		const entry = entries.get(key)
		if (!entry) return false

		clearTimer(key)
		entries.delete(key)

		if (typeof entry.onExpire === "function") {
			entry.onExpire({
				key,
				value: entry.value,
				expiresAt: entry.expiresAt,
			})
		}

		return true
	}

	const deleteEntry = (key) => {
		clearTimer(key)
		return entries.delete(key)
	}

	const set = (key, value, ttlMs, options = {}) => {
		if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new RangeError("TTL must be a positive finite number")
		deleteEntry(key)

		const { onExpire } = options
		const expiresAt = Date.now() + ttlMs
		const timer = setTimeout(() => {
			expireEntry(key)
		}, ttlMs)

		if (typeof timer.unref === "function") timer.unref()


		entries.set(key, { value, expiresAt, onExpire })
		timers.set(key, timer)

		return value
	}

	const getEntry = (key) => {
		const entry = entries.get(key)
		if (!entry) return undefined

		if (entry.expiresAt <= Date.now()) {
			expireEntry(key)
			return undefined
		}

		return entry
	}

	const get = (key) => getEntry(key)?.value

	const has = (key) => getEntry(key) !== undefined

	const clear = () => {
		for (const timer of timers.values()) {
			clearTimeout(timer)
		}

		entries.clear()
		timers.clear()
	}

	return {
		set,
		get,
		has,
		delete: deleteEntry,
		expire: expireEntry,
		clear,
	}
}

export default createCache
