# VELoop Rewards

VELoop Rewards is a MERN Daily Streak demo with JWT authentication, MongoDB-backed reward configuration, sequential claims, a VE wallet ledger, and a responsive VELoop-themed React interface.

## Features

- Registration, login, `/me`, logout, and protected routes.
- Server-controlled seven-day streak cycle with 24-hour claim spacing and 48-hour missed-day reset.
- Backend-controlled reward type, currency, amount, and eligibility.
- Atomic VE wallet credits and persisted wallet transactions.
- Idempotent and unique-index-protected claims with audit events.
- Server-time anchored frontend countdown and explicit loading/error/unauthorized states.
- Optional local CPA placeholder for the UI; it never grants a reward and is disabled by default.

## Stack and architecture

- Frontend: React 18, React Router, Vite, Axios, Bootstrap, CSS Modules, Lucide icons.
- Backend: Node.js, Express, Mongoose, JWT, Node `scrypt` password hashing.
- Database: MongoDB replica set or MongoDB Atlas. Transactions are required for claims.

```text
frontend/src -> Axios bearer client -> backend/src/routes
                                      -> controllers/services
                                      -> MongoDB transaction
                                      -> cycle + claim + wallet + ledger + audit
```

The frontend is not the source of truth. The backend derives identity from the verified JWT and derives all reward and timing values from MongoDB.

## Local setup

Requirements: Node.js 18+, npm, and MongoDB configured as a replica set (a single-node local replica set is sufficient).

```bash
cd backend
npm install
cp .env.example .env
```

Set a real local `JWT_SECRET` and a valid replica-set/Atlas `MONGODB_URI`. Never commit `.env`.

```bash
SEED_STREAK_REWARDS=true npm run seed
npm run dev
```

The API runs on `http://localhost:5002` by default.

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The UI runs on `http://localhost:5173`. Open `/signup`, create an account, and continue to `/daily-streak`. There is no seed user or default credential.

## Environment variables

Backend variables are documented in `backend/.env.example`; frontend variables are documented in `frontend/.env.example`.

- `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` configure the API.
- `SEED_STREAK_REWARDS` and `ALLOW_PRODUCTION_SEED` control the insert-only seed.
- `VITE_API_BASE_URL` configures the frontend API URL.
- `VITE_STREAK_DEMO=false` must remain false for real integration testing.

Production uses these variables with a deployed frontend origin, HTTPS API URL, Atlas URI, and deployment secret manager values. Do not deploy with localhost values.

## Daily Streak flow

1. The user registers or logs in and receives a JWT stored by the frontend in `localStorage.veloop_token`.
2. Protected status requests send the bearer token and receive server time, cycle state, seven cards, wallet balance, and `nextClaimAt`.
3. The UI can open a local placeholder CPA step, but only the explicit real-claim action calls `POST /api/daily-streak/claim`.
4. The backend recalculates the actual day/reward and commits claim, wallet, transaction, cycle, and audit writes atomically.
5. The UI refetches state after success, refresh, visibility return, and countdown expiry.

## API overview

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Bearer JWT |
| POST | `/api/auth/logout` | Bearer JWT |
| GET | `/api/daily-streak` | Bearer JWT |
| GET | `/api/daily-streak/status` | Bearer JWT |
| POST | `/api/daily-streak/claim` | Bearer JWT |
| GET | `/api/daily-streak/history` | Bearer JWT |
| GET | `/api/streak/config` | Bearer JWT |

Full request/response examples are in [API_DOCUMENTATION.md](API_DOCUMENTATION.md). A Postman collection is in [postman/VELoop-Rewards.postman_collection.json](postman/VELoop-Rewards.postman_collection.json).

## Tests and documentation

```bash
cd backend && npm run check
cd ../frontend && npm run build
```

The verified matrix and reproducible test steps are in [TESTING.md](TESTING.md). Database relationships are in [DATABASE.md](DATABASE.md), security controls and remaining production controls are in [SECURITY.md](SECURITY.md), and the implementation rationale is in [docs/DAILY_STREAK_ARCHITECTURE.md](docs/DAILY_STREAK_ARCHITECTURE.md).

## Deployment preparation

The frontend is a standard Vite build suitable for Vercel or Netlify. The backend is a standard Node start process suitable for Render or Railway. Configure `VITE_API_BASE_URL`, backend `CORS_ORIGIN`, Atlas `MONGODB_URI`, and a strong `JWT_SECRET` in the platform secret manager. Claims require a MongoDB deployment that supports transactions. Deployment was not performed because no hosting credentials or deployment target was supplied.

## Project structure

```text
backend/src/{config,controllers,middleware,models,routes,services,seed,utils}
frontend/src/{components,context,features,services}
docs/
postman/
API_DOCUMENTATION.md  DATABASE.md  SECURITY.md  TESTING.md
```

## Final requirement checklist

- [x] Authentication and protected routes
- [x] MongoDB persistence
- [x] Backend-driven streak and rewards
- [x] Sequential claims and missed-day reset logic
- [x] VE wallet integration and transactions
- [x] Duplicate and concurrency protection
- [x] Server-time countdown/refetch behavior
- [x] API, database, security, and testing documentation
- [x] Deployment configuration without committed secrets
- [ ] Production hosting deployment and external gift-card fulfillment (outside this workspace)
