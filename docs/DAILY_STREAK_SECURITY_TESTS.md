# Daily Streak Security Test Procedure

These checks require MongoDB running as a replica set because claim processing uses a MongoDB transaction. Configure `backend/.env`, seed the rewards, and start the API before running them.

```bash
cd backend
SEED_STREAK_REWARDS=true npm run seed
npm run dev
```

Obtain a legitimate token by registering or logging in. The API verifies the token and confirms that its subject belongs to an active database user; it never reads `userId` from a request body.

```bash
TOKEN=$(curl -s -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"qa-user@example.com","displayName":"QA User","password":"qa-password-123"}' \
  | jq -r '.token')
```

If the account already exists, use `POST /api/auth/login` with the same email and password instead. Use a disposable development account and remove it after testing.

## Repeatable scenarios

```bash
# 1. Unauthorized request: expected 401
curl -i http://localhost:5002/api/daily-streak

# 2. Initial status: expected currentDay 1 and card state AVAILABLE
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5002/api/daily-streak | jq

# 3. Valid Day 1 claim: expected 201, configured +5 VE, and a wallet transaction
curl -s -X POST http://localhost:5002/api/daily-streak/claim \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey":"day-1-attempt-1"}' | jq

# 4. Same idempotency key: expected 200 replay, not a second credit
curl -s -X POST http://localhost:5002/api/daily-streak/claim \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey":"day-1-attempt-1"}' | jq

# 5. Locked next day: expected 409 CLAIM_LOCKED
curl -s -X POST http://localhost:5002/api/daily-streak/claim \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey":"day-2-too-early"}' | jq

# 6. Jump attempt: expected 409 DAY_MISMATCH; the supplied day is never authoritative
curl -s -X POST http://localhost:5002/api/daily-streak/claim \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"day":7,"amount":"999999","currency":"USD","rewardType":"VE","streak":99,"userId":"another-user"}' | jq

# 7. Concurrent attempts: only one request may create the day claim and wallet credit
seq 1 10 | xargs -I{} -P10 curl -s -X POST http://localhost:5002/api/daily-streak/claim \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey":"concurrent-{}"}'

# 8. History: expected only authenticated user's claims
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:5002/api/daily-streak/history | jq
```

The database assertions are: one unique `StreakClaim` per `(cycleId, dayNumber)`, one unique wallet transaction per streak claim, and a wallet balance equal to the sum of posted VE transactions. A claim for another user's JWT must create a separate user state and cannot access the first user's cycle.
