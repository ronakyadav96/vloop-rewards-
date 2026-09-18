import jwt from 'jsonwebtoken';
import { getAuthenticatedUser } from '../services/auth.service.js';

export async function requireAuth(req, res, next) {
  const authorization = req.get('authorization');
  const [scheme, token, ...extraParts] = authorization?.trim().split(/\s+/) ?? [];

  if (scheme !== 'Bearer' || !token || extraParts.length > 0) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace-with-a-long-development-secret') {
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  let userId;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userId = typeof payload === 'object' ? payload.sub ?? payload.id : undefined;

    if (!userId) {
      return res.status(401).json({ message: 'Token does not identify a user' });
    }
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    req.user = { id: String(userId), user: await getAuthenticatedUser(userId) };
    return next();
  } catch (error) {
    return next(error);
  }
}
