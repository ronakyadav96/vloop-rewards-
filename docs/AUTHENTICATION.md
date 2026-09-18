# VELoop Authentication

## Current implementation

- `POST /api/auth/register` creates a User account and returns a signed JWT.
- `POST /api/auth/login` verifies email/password and returns a signed JWT.
- `GET /api/auth/me` verifies the bearer token and returns the current user.
- `POST /api/auth/logout` confirms sign-out; the frontend removes the stateless JWT from localStorage.

Authentication uses JWTs in the `Authorization: Bearer <token>` header. It does not use cookies or session storage. The frontend stores the legitimate token returned by login or registration under `localStorage.veloop_token` and attaches it through the centralized Axios client.

The backend must have a real `JWT_SECRET`; the placeholder value is intentionally rejected. The local `.env` file is ignored by Git and must not be committed.

## Testing

1. Set a non-placeholder `JWT_SECRET` in `backend/.env` and restart the backend on port 5002.
2. Start the frontend on port 5173.
3. Open `http://localhost:5173/signup`.
4. Register with a valid email, a display name of at least two characters, and a password of at least eight characters.
5. Registration stores the returned JWT and redirects to `/daily-streak`.
6. Sign out using the account button in the Daily Streak header.
7. Open `/login`, sign in with the same credentials, and confirm the redirect back to `/daily-streak`.
8. In browser DevTools Network, confirm `/api/daily-streak` is sent to `http://localhost:5002/api/daily-streak` with `Authorization: Bearer ...`.

There is no development seed user or default test credential. Use the signup flow to create one.
