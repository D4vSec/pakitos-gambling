import crypto from "node:crypto"

const randomInt = (min, max) => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new TypeError("min y max deben ser enteros")
    }

    if (max <= min) {
        throw new RangeError("max debe ser mayor que min")
    }

    return crypto.randomInt(min, max)
}

const randomIntInclusive = (min, max) => {
    return randomInt(min, max + 1)
}

const randomFloat = () => {
    const buffer = crypto.randomBytes(4)
    const uint = buffer.readUInt32BE(0)
    return uint / 0xffffffff
}

const randomId = (length = 32) => {
    return crypto.randomBytes(length).toString("hex")
}

const shuffle = (array) => {
    const arr = [...array]

    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
}

export { randomInt, randomIntInclusive, randomFloat, randomId, shuffle }