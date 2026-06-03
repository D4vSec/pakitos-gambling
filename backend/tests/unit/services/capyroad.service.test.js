import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("#utils/rng.utils", () => ({
    randomFloatInRange: vi.fn(),
    randomIntInclusive: vi.fn(),
}))

import createCapyRoad from "../../../src/services/capyroad.service.js"
import { randomFloatInRange } from "#utils/rng.utils"

describe("capyroad service", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("builds a monotonic multiplier path that still ends at the cap", () => {
        randomFloatInRange
            .mockReturnValueOnce(0.85)
            .mockReturnValueOnce(0.05)
            .mockReturnValue(0)

        const capyRoad = createCapyRoad()
        const path = capyRoad.createMultiplierPath(1, 5)

        expect(path).toHaveLength(5)
        expect(path[0]).toBe(1)
        expect(path[path.length - 1]).toBe(3)
        for (let index = 1; index < path.length; index++) {
            expect(path[index]).toBeGreaterThanOrEqual(path[index - 1])
        }
    })

    it("changes the curve when the RNG changes", () => {
        randomFloatInRange
            .mockReturnValueOnce(0.7)
            .mockReturnValueOnce(0.03)
            .mockReturnValue(0)

        const firstPath = createCapyRoad().createMultiplierPath(1, 6)

        vi.clearAllMocks()

        randomFloatInRange
            .mockReturnValueOnce(1.2)
            .mockReturnValueOnce(0.03)
            .mockReturnValue(0)

        const secondPath = createCapyRoad().createMultiplierPath(1, 6)

        expect(firstPath).not.toEqual(secondPath)
    })
})
