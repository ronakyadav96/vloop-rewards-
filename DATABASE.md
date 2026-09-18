# VELoop Rewards Database

MongoDB is the persistence layer. Claim processing requires a replica set or MongoDB Atlas because claim, wallet, ledger, cycle, and audit writes share one transaction.

## Collections and relationships

| Model | Purpose | Important constraints |
|---|---|---|
| `User` | Registered account and password hash/salt | Unique indexed email; password fields are `select: false`; active flag |
| `StreakConfig` | Active cycle definition | Unique `key`; indexed `active` |
| `StreakReward` | One backend-controlled reward per day/config | Unique `(configId, dayNumber)` |
| `StreakCycle` | Authoritative per-user cycle state | Unique active cycle per user; unique `(userId, cycleNumber)` |
| `StreakClaim` | Immutable claim and reward snapshot | Unique `(cycleId, dayNumber)` and unique `(userId, idempotencyKey)` when supplied |
| `Wallet` | One VE balance per user | Unique `userId`; Decimal128 balance |
| `WalletTransaction` | Posted wallet ledger entry | Unique `(walletId, source, sourceReference)` |
| `AuditLog` | Claim/reset/security event trail | Indexed event and user ID |

`User` is the identity root. Other user-owned documents use the verified JWT subject as `userId`. A cycle references its configuration; claims reference the cycle, configuration, reward, and optional wallet transaction. Claims copy a reward snapshot so later configuration edits cannot rewrite history.

## Cycle structure

An active cycle begins at `nextDay: 1`, `currentStreak: 0`, and an immediately available `nextClaimAt`. Each successful claim advances `currentStreak`, `nextDay`, `lastClaimAt`, and `nextClaimAt`. Day 7 marks the cycle `COMPLETED`; a new cycle starts after its 24-hour wait. A request more than 48 hours after the prior claim marks the active cycle `RESET`, records `STREAK_RESET`, and creates a new Day 1 cycle.

## Claim and wallet consistency

The server loads the active configuration, calculates the actual day, verifies sequential/time rules, creates a `PROCESSING` claim, and snapshots the configured reward. For VE rewards it atomically updates the Decimal128 wallet and creates a `POSTED` `WalletTransaction` with `balanceBefore` and `balanceAfter`. The claim is finalized and the cycle is advanced in the same MongoDB transaction. Gift-card claims are stored as `PENDING_FULFILLMENT`; no external gift card is issued by this project.

## Duplicate protection

Service validation checks the current cycle/day, MongoDB unique indexes reject races for cycle/day, idempotency key, and wallet source reference, and the transaction rolls back partial writes. An idempotent replay returns the original claim without creating another wallet transaction. No frontend field can set a wallet balance or reward amount.

## Operations

The seed is opt-in and insert-only. It creates the default seven-day configuration and missing rewards, but does not overwrite existing records. Database credentials and JWT secrets belong only in ignored environment files or the deployment secret manager.
