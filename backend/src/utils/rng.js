import crypto from "node:crypto"

const secureRandomInt = (min, max) => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new TypeError("min y max deben ser enteros")
    }

    if (max <= min) {
        throw new RangeError("max debe ser mayor que min")
    }

    return crypto.randomInt(min, max)
}

const secureRandomIntInclusive = (min, max) => {
    return secureRandomInt(min, max + 1)
}

const secureRandomFloat = () => {
    const buffer = crypto.randomBytes(4)
    const uint = buffer.readUInt32BE(0)
    return uint / 0xffffffff
}

const secureRandomId = (length = 32) => {
    return crypto.randomBytes(length).toString("hex")
}

const secureShuffle = (array) => {
    const arr = [...array]

    for (let i = arr.length - 1; i > 0; i--) {
        const j = secureRandomInt(0, i + 1)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
}

export { secureRandomInt, secureRandomIntInclusive, secureRandomFloat, secureRandomId, secureShuffle }
