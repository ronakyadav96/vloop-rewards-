import { getAuthenticatedUser, loginUser, registerUser } from '../services/auth.service.js';
import { DomainError } from '../utils/errors.js';

function requireBody(body) {
  if (!body || typeof body !== 'object') {
    throw new DomainError('INVALID_REQUEST', 'Request body is required', 422);
  }
  return body;
}

export async function register(req, res, next) {
  try {
    const body = requireBody(req.body);
    const result = await registerUser({
      email: body.email,
      displayName: body.displayName,
      password: body.password,
    });
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const body = requireBody(req.body);
    const result = await loginUser({ email: body.email, password: body.password });
    return res.json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
}

export async function currentUser(req, res, next) {
  try {
    const user = await getAuthenticatedUser(req.user.id);
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
}

export function logout(_req, res) {
  // JWT access tokens are stored client-side and are cleared by the client on logout.
  return res.json({ success: true, message: 'Signed out successfully' });
}

