# VELoop Rewards API

Base URL: `http://localhost:5002/api` locally. Set the frontend `VITE_API_BASE_URL` to the deployed API URL in production.

Authentication uses a JWT returned by registration or login. Send it on protected requests as `Authorization: Bearer <token>`.

## Authentication

### `POST /auth/register`

Public. Body: `{"email":"user@example.com","displayName":"Demo User","password":"at-least-8-characters"}`. Returns `201` with `{ success, token, user: { id, email, displayName } }`. Validation errors return `422`; duplicate email returns `409`.

### `POST /auth/login`

Public. Body: `{"email":"user@example.com","password":"at-least-8-characters"}`. Returns `200` with `{ success, token, user }`. Invalid credentials return `401`.

### `GET /auth/me`

Bearer token required. Returns `200` with `{ success, user }`. Missing, invalid, expired, deleted, or inactive sessions return `401`.

### `POST /auth/logout`

Bearer token required. Returns `200` with `{ success, message }`. JWT logout is stateless: the client removes its token. Token revocation is not implemented.

## Daily Streak

All endpoints below require a valid bearer token. The user ID is taken from the verified JWT; it is never accepted from the request body.

### `GET /daily-streak` and `GET /daily-streak/status`

Returns the current server-controlled streak state. No request body is required.

```json
{
  "success": true,
  "serverTime": "2026-09-17T08:00:00.000Z",
  "currentStreak": 1,
  "currentDay": 2,
  "checkedIn": true,
  "totalRewards": 1,
  "nextClaimAt": "2026-09-18T08:00:00.000Z",
  "streakStatus": "ACTIVE",
  "cards": [{"day":1,"state":"CLAIMED"},{"day":2,"state":"LOCKED"}],
  "nextReward": {"day":2,"rewardType":"VE","currency":"VE","amount":"10"},
  "wallet": {"currency":"VE","balance":"5"}
}
```

Card states are `AVAILABLE`, `LOCKED`, or `CLAIMED`. On a server-detected missed window, the response includes `resetOccurred: true` and `lastReset`.

### `POST /daily-streak/claim`

Bearer token required. The body may contain only optional request metadata: `{"idempotencyKey":"client-generated-unique-key"}`. An optional positive integer `day` is accepted as an assertion and is compared with the server-calculated day. `amount`, `currency`, `rewardType`, `streak`, `userId`, and timing fields are not authorities.

Successful first claims return `201`; an idempotent replay returns `200` with `replayed: true`.

```json
{
  "success": true,
  "replayed": false,
  "serverTime": "2026-09-17T08:00:00.000Z",
  "nextClaimAt": "2026-09-18T08:00:00.000Z",
  "claim": {"day":1,"status":"SUCCESS","reward":{"amount":"5","currency":"VE"}},
  "wallet": {"currency":"VE","balance":"5"}
}
```

Typical errors: `401` authentication failure; `409` for `CLAIM_LOCKED`, `DAY_MISMATCH`, `SEQUENCE_INVALID`, `DUPLICATE_CLAIM`, or cycle lock; `422` malformed input; `503` unavailable/incomplete configuration or unsupported MongoDB transactions.

### `GET /daily-streak/history?limit=50`

Bearer token required. `limit` is optional and clamped to 1–100. Returns only the authenticated user’s claims: `{"success":true,"count":1,"claims":[{"day":1,"status":"SUCCESS","reward":{"amount":"5","currency":"VE"}}]}`.

## Configuration and errors

`GET /streak/config` is protected and returns the active reward configuration. There is no separate wallet endpoint; the current wallet balance is included with streak status and claim responses, and every VE credit has a persisted wallet transaction.

Domain errors use `{ success: false, error: { code, message, details? } }`. Malformed JSON returns `400 INVALID_JSON`; unknown routes return `404`.
