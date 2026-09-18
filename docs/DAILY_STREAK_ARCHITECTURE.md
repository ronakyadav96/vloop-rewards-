# Daily Streak Architecture — Parts 1 and 2

## Existing project analysis

The supplied repository was empty before Part 1. There was no frontend or backend directory, package manifest, authentication implementation, User model, Wallet model, route convention, database connection, reusable UI system, or existing streak feature. Part 1 therefore created the MERN foundation. Part 2 preserves that JWT middleware and reward configuration and adds the streak engine plus the smallest persistent VE wallet ledger required to award VE rewards.

## Backend structure

```text
backend/src/
  config/db.js
  controllers/
    streakController.js            Part 1 configuration endpoint
    dailyStreakController.js       Part 2 request parsing and responses
  middleware/auth.js               verified JWT identity only
  models/
    StreakConfig.js
    StreakReward.js
    StreakCycle.js
    StreakClaim.js
    Wallet.js
    WalletTransaction.js
    AuditLog.js
  routes/
    streakRoutes.js
    dailyStreakRoutes.js
  services/
    streak.service.js              cycle, eligibility, claim orchestration
    reward.service.js               active backend reward configuration
    wallet.service.js               atomic VE balance and ledger credit
    transaction.service.js          MongoDB transaction boundary
    audit.service.js                event records
  utils/
    date.js                         server-time windows
    errors.js                       safe domain errors
```

## Data model and relationships

```text
StreakConfig 1 ─── * StreakReward
User identity (JWT subject string)
      1 ─── * StreakCycle 1 ─── * StreakClaim * ─── 1 StreakReward
      1 ─── 1 Wallet 1 ─── * WalletTransaction
StreakClaim 1 ─── 0..1 WalletTransaction
```

`StreakCycle` stores the authoritative current streak, next day, last claim time, next claim time, status, and cycle number. `StreakClaim` stores a reward snapshot so later configuration changes cannot rewrite claim history. `Wallet` and `WalletTransaction` were added because no wallet existed in the supplied project; they are persistent MongoDB records, not frontend or in-memory fake balance state. Gift-card claims do not create wallet credits; they are recorded with `PENDING_FULFILLMENT` until an external fulfillment system exists.

Unique indexes enforce concurrency safety:

- One active cycle per user.
- One cycle number per user.
- One claim per `(cycleId, dayNumber)`.
- One claim per `(userId, idempotencyKey)` when a key is supplied.
- One wallet transaction per streak claim source reference.

## Streak algorithm

The assignment does not define whether a “day” means a calendar date or a rolling 24-hour window. Part 2 uses this explicit rule:

1. A user’s first status or claim request creates an active cycle at Day 1. Day 1 is immediately available.
2. A successful claim advances the cycle sequentially. The actual next day always comes from `StreakCycle.nextDay`.
3. The next claim is available exactly 24 hours after the previous claim’s server `claimedAt` timestamp. The browser clock and client countdown are never used.
4. A claim is considered missed when the user returns more than 48 hours after the previous successful claim. On that request, the old cycle is marked `RESET`, a `STREAK_RESET` audit event is written, and a new Day 1 cycle is created. Day 1 is then available immediately.
5. The 24-to-48-hour interval is the allowed claim window for the next sequential day. A request before 24 hours returns `CLAIM_LOCKED` and does not change state.
6. After Day 7, the cycle is `COMPLETED`. A new cycle becomes available 24 hours after the Day 7 claim.
7. Reset and cycle creation happen when the API is called, so the result does not depend on whether the browser was open. All state is stored in MongoDB and survives refreshes and new logins.

The status response uses these card states:

- `AVAILABLE`: the backend-calculated next day can be claimed now.
- `LOCKED`: a future day or the next day’s 24-hour wait is not complete.
- `CLAIMED`: a claim exists for that day in the current cycle.
- `MISSED`: used in reset metadata for the previous cycle’s missed day; the active post-reset cycle starts again at Day 1.
- `TODAY`: not used as an authority or eligibility state; clients should use `AVAILABLE` and `nextClaimAt`.

## Authentication and trust boundary

The client sends `Authorization: Bearer <JWT>`. `middleware/auth.js` verifies the token using `JWT_SECRET`, confirms the subject belongs to an active user, and places the verified identity in `req.user.id` together with the serialized user object. The daily streak routes never accept a user ID as an authority. `day`, `amount`, `currency`, `rewardType`, `reward`, and `streak` in a request body are ignored except that an optional `day` is compared against the server-calculated day and can cause a safe `DAY_MISMATCH` response.

## API contract

```text
GET  /api/daily-streak
GET  /api/daily-streak/status
POST /api/daily-streak/claim
GET  /api/daily-streak/history
```

`GET /api/daily-streak` and `/status` return `serverTime`, `currentStreak`, `currentDay`, `checkedIn`, `totalRewards`, `nextClaimAt`, cycle/config metadata, wallet balance, `nextReward`, and seven backend-calculated cards. Each card includes its state, configured reward snapshot, claim status, and applicable `nextClaimAt`. After a reset, `lastReset.state` is `MISSED` and identifies the previous cycle’s missed day.

`POST /claim` accepts only optional `day` and `idempotencyKey` for an action request. It derives the actual day, reward, amount, currency, and user from server state. VE claims create a `StreakClaim`, credit `Wallet.veBalance`, create a `WalletTransaction` containing `balanceBefore` and `balanceAfter`, and link both records. Gift-card claims are successful claims with `PENDING_FULFILLMENT`; actual Amazon fulfillment is outside this assignment.

## Transactions and failure handling

Each claim runs inside a MongoDB transaction with majority write concern. The claim starts as `PROCESSING`, the wallet and wallet transaction are written, then the claim and cycle are finalized. Any failure aborts the transaction. Duplicate indexes and transaction conflict handling ensure simultaneous requests cannot grant the same cycle day twice. A deployment must use a MongoDB replica set (including a single-node local replica set) because standalone MongoDB does not support the required transaction boundary; the API returns a safe `DATABASE_TRANSACTION_REQUIRED` error otherwise.

## Audit events

The backend records claim requests, successful claims, rejected claims, resets, duplicate claims, and invalid claims in `AuditLog`. Database details are logged server-side only; API errors expose stable codes and safe messages.

## Seed and operations

Seeding is opt-in through `SEED_STREAK_REWARDS=true`, blocked in production unless explicitly allowed, and insert-only. Existing config and reward documents are never deleted or overwritten by the development seed. No real credential is stored in the repository.
