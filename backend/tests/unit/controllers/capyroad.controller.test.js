import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("#services/capyroad.service", () => ({
    default: vi.fn(),
}))

vi.mock("#models/user.model", () => ({
    default: {
        getUserBalance: vi.fn(),
        updateUserBalance: vi.fn(),
    },
}))

vi.mock("#utils/rng.utils", () => ({
    randomId: vi.fn(),
}))

vi.mock("#utils/logger.utils", () => ({
    default: {
        error: vi.fn(),
    },
}))

import { startGame } from "../../../src/controllers/capyroad.controller.js"
import createCapyRoad from "#services/capyroad.service"
import User from "#models/user.model"

const createResponse = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
})

describe("capyroad.controller", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("capyroad-game-id")

        User.getUserBalance.mockResolvedValue(100)
        User.updateUserBalance.mockResolvedValue(90)
        createCapyRoad.mockReturnValue({
            createMultiplierPath: vi.fn(() => [1, 1.5, 2]),
        })
    })

    it("returns 400 for invalid bet amounts", async () => {
        const res = createResponse()

        await startGame(
            {
                user: { id: "user-1" },
                body: {},
            },
            res,
        )

        expect(User.getUserBalance).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ code: "INVALID_BET_AMOUNT" })
    })

    it("returns 400 when the user balance is insufficient", async () => {
        User.getUserBalance.mockResolvedValueOnce(5)
        const res = createResponse()

        await startGame(
            {
                user: { id: "user-1" },
                body: { amount: 10 },
            },
            res,
        )

        expect(User.getUserBalance).toHaveBeenCalledWith("user-1")
        expect(User.updateUserBalance).not.toHaveBeenCalled()
        expect(createCapyRoad).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ code: "INSUFFICIENT_BALANCE" })
    })

    it("returns 400 when the opening debit cannot be applied", async () => {
        User.updateUserBalance.mockResolvedValueOnce(null)
        const res = createResponse()

        await startGame(
            {
                user: { id: "user-1" },
                body: { amount: 10 },
            },
            res,
        )

        expect(User.updateUserBalance).toHaveBeenCalledWith("user-1", -10, { type: "BET" })
        expect(createCapyRoad).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ code: "INSUFFICIENT_BALANCE" })
    })

    it("creates the game only after the initial bet is charged", async () => {
        const res = createResponse()

        await startGame(
            {
                user: { id: "user-1" },
                body: { amount: "10" },
            },
            res,
        )

        expect(User.getUserBalance).toHaveBeenCalledWith("user-1")
        expect(User.updateUserBalance).toHaveBeenCalledWith("user-1", -10, { type: "BET" })
        expect(createCapyRoad).toHaveBeenCalledTimes(1)
        expect(globalThis.crypto.randomUUID).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                gameID: "capyroad-game-id",
                game: "capyroad",
                userId: "user-1",
                amount: 10,
                payout: 10,
                info: expect.objectContaining({
                    payoutMultiplier: 1,
                    multipliers: [1, 1.5, 2],
                }),
            }),
        )
    })
})
