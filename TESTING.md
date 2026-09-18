# VELoop Rewards Test Matrix

The rows below record local verification for this final pass. API tests used a temporary authenticated development account and were cleaned up afterward. No seed user or production credential exists.

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Registration/login | Token and user returned | `201` register and `200` login | PASS |
| Authentication persistence | `/me` works with bearer token | `200`; localStorage/interceptor path verified in source and build; browser persistence not automated | PARTIAL |
| Normal claim | One configured reward is granted | `201`, Day 1, wallet `5` VE | PASS |
| Already claimed | No second credit | New Day 1 assertion returned `409 DAY_MISMATCH`; ledger remained one entry | PASS |
| Locked reward | Early claim rejected | `409 CLAIM_LOCKED` verified in API flow | PASS |
| Sequential claim | Cannot skip server next day | Jump/body manipulation rejected with `409 DAY_MISMATCH` | PASS |
| Missed day/reset | State resets after 48 hours | Safe MongoDB state shift to 49 hours produced `resetOccurred: true`, new Day 1, unchanged wallet/history | PASS |
| Duplicate idempotency | Replay is safe | Same key returned `200 replayed: true`; wallet stayed `5` | PASS |
| Concurrent claim | At most one reward | Concurrent same-user requests produced one persisted claim/ledger entry | PASS |
| Fake reward/amount/type/currency | Client values cannot change reward | Manipulated values were ignored; configured reward was used | PASS |
| Fake day | Server controls day | Invalid jump returned `409 DAY_MISMATCH` | PASS |
| Fake user | Body cannot change identity | `userId` body field did not affect owner | PASS |
| Changed device time | Browser clock cannot unlock | Server-time implementation and backend re-check were audited; browser clock override was not automated | PARTIAL |
| Unauthorized request | Protected API returns `401` | No bearer returned `401` | PASS |
| Invalid authentication | Session is rejected | Invalid JWT returned `401`; interceptor clears token | PASS |
| Expired authentication | Expired JWT is rejected | An actually expired JWT was not executed in this pass | NOT VERIFIED |
| Refresh | State remains persisted | A fresh authenticated status request returned Day 2/claimed Day 1/wallet `5`; literal browser refresh was not automated | PARTIAL |
| Multiple tabs | Same backend rules apply | Unique/idempotent backend protection verified; real tab automation unavailable | PARTIAL |
| Wallet consistency | Balance matches VE credits | One claim, one ledger row, balance `5` | PASS |
| Transaction consistency | No partial writes | Replica-set transaction claim test passed | PASS |
| Frontend production build | Vite build completes | `npm run build` completed successfully | PASS |
| Backend syntax check | Check command completes | `npm run check` completed successfully | PASS |
| HTTP route serving | Frontend routes reachable | `/login`, `/signup`, `/daily-streak` returned `200` from Vite | PASS |

## Reproduce locally

```bash
cd backend
cp .env.example .env
# Set a real JWT_SECRET and a replica-set/Atlas MONGODB_URI.
SEED_STREAK_REWARDS=true npm run seed
npm start

cd ../frontend
cp .env.example .env
npm run dev
```

Use `/signup`, claim Day 1 once, refresh, and inspect Network requests for the bearer header. Keep `VITE_STREAK_DEMO=false` for integration testing.

## Scope note

Automated verification covered API/database integration and production builds. No Playwright/browser-DOM runner was available, so visual checks at every requested viewport and literal multi-tab/sleep-wake interaction should be repeated manually before release.
