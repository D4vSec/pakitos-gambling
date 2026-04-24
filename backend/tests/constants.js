const ENABLE_VERBOSE_LOGGING = true

const logIfVerbose = (...args) => {
	if (ENABLE_VERBOSE_LOGGING) {
		console.log(...args)
	}
}

export { ENABLE_VERBOSE_LOGGING, logIfVerbose }
