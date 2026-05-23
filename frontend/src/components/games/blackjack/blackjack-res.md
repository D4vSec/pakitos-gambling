**Start game**

```js
{
    "gameId": "45c7c4e4-5bfd-48a3-a2e6-04c057215033",
    "userId": "49f505c5-9625-4a4a-a561-34e5c42642ed",
    "game": "blackjack",
    "status": "ongoing",
    "split": false,
    "createdAt": "2026-05-23T12:04:48.842Z",
    "player": [
        {
            "hand": [
                {
                    "rank": "6",
                    "suit": "Clubs",
                    "id": "e67fdeb6-c8d8-470f-ae4f-54c441eddc05"
                },
                {
                    "rank": "6",
                    "suit": "Spades",
                    "id": "768de8db-18e0-483c-a97c-bd765d5bf9da"
                }
            ],
            "value": 12,
            "bust": false,
            "blackjack": false,
            "doubled": false,
            "resolved": false,
            "bet": 1
        }
    ],
    "dealer": [
        {
            "hand": [
                {
                    "rank": "J",
                    "suit": "Diamonds",
                    "id": "8369058e-e53b-4ddb-9f7d-4b563a29352a"
                },
                {
                    "rank": "hidden",
                    "suit": "hidden",
                    "id": "d8ff4065-1c35-44d6-8b93-821c980d5268"
                }
            ],
            "value": 10,
            "bust": false,
            "blackjack": false,
            "resolved": false
        }
    ],
    "winners": [],
    "payout": 0
}
```

**Game splited**
'``js
```

**Game finished**

```js
{
    "gameId": "802094da-4b5d-4ce9-ab4c-8f60d0a07bb3",
    "userId": "49f505c5-9625-4a4a-a561-34e5c42642ed",
    "game": "blackjack",
    "status": "finished",
    "split": false,
    "createdAt": "2026-05-23T12:18:52.743Z",
    "player": [
        {
            "hand": [
                {
                    "rank": "7",
                    "suit": "Diamonds",
                    "id": "94402920-d043-4709-9267-efa1033efd45"
                },
                {
                    "rank": "7",
                    "suit": "Spades",
                    "id": "9137dbac-907f-41be-9d3f-5dd2963a838e"
                }
            ],
            "value": 14,
            "bust": false,
            "blackjack": false,
            "doubled": false,
            "resolved": true,
            "bet": 1
        }
    ],
    "dealer": [
        {
            "hand": [
                {
                    "rank": "2",
                    "suit": "Hearts",
                    "id": "9077a3c5-7816-4b13-8328-e3f472e85426"
                },
                {
                    "rank": "6",
                    "suit": "Clubs",
                    "id": "f24cc624-b6b8-451e-80ea-448100edd365"
                },
                {
                    "rank": "Q",
                    "suit": "Hearts",
                    "id": "0da6af21-1861-4b11-a805-f90b37171b36"
                }
            ],
            "value": 18,
            "bust": false,
            "blackjack": false,
            "resolved": false
        }
    ],
    "winners": [
        "dealer"
    ],
    "payout": 0
}
```


