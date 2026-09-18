# VELoop Rewards Security

## Trust boundary

Frontend is not the source of truth. The backend determines the authenticated user, active reward configuration, claimable day, reward amount/type/currency, streak state, timing, wallet balance, and history. The UI countdown is visual only and a zero timer always triggers a fresh API read.

## Authentication and authorization

- Registration and login return a signed JWT.
- The frontend stores it under `localStorage.veloop_token` and sends `Authorization: Bearer <token>` through one Axios client.
- `requireAuth` verifies the signature and confirms the user still exists and is active.
- Daily Streak, history, configuration, `/me`, and logout routes are protected.
- User IDs are not accepted from Daily Streak request bodies.
- Token expiry/invalidity clears the frontend session and redirects to login.
- Logout is stateless and clears the client token; immediate revocation would require a server-side refresh-token/revocation design.

## Reward and wallet protection

Claim requests accept only an optional day assertion and idempotency key. Client-supplied amount, reward type, currency, streak, wallet balance, next claim time, and user ID cannot authorize a claim. Rewards are loaded from MongoDB, and VE credits use Decimal128 plus a transaction ledger.

## Duplicate and concurrency protection

Claims, cycle state, wallet updates, ledger entries, and audit events are committed in a MongoDB transaction. Unique indexes protect the cycle/day, idempotency key, and wallet source reference. A duplicate or racing request is rejected or replayed and cannot double-credit the wallet.

## Input, transport, and secrets

- Email/password and claim inputs are validated server-side.
- JSON request bodies are limited to 16 KB.
- Invalid JSON receives a safe `400` response.
- CORS uses the comma-separated `CORS_ORIGIN` allow-list; when unset, cross-origin browser access is disabled rather than wildcarded.
- `JWT_SECRET`, MongoDB credentials, and deployment secrets must be supplied through environment variables and never committed.
- `.env` and `.env.*` are ignored; only placeholder `.env.example` files are tracked.
- Use HTTPS, a secret manager, and a production MongoDB TLS connection in deployment.

## Residual production controls

Before a public launch, add an API gateway/WAF, rate limiting on registration/login/claims, structured redacted logging, refresh-token rotation or server-side revocation, monitoring, backups, and a real gift-card fulfillment worker. These are deployment controls, not client-side trust mechanisms.
