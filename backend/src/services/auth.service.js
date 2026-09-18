import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { hashPassword, verifyPassword } from './password.service.js';
import { DomainError } from '../utils/errors.js';

export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

export function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    displayName: user.displayName,
  };
}

function createAccessToken(user) {
  assertAuthConfigured();
  return jwt.sign(
    { sub: String(user._id), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function assertAuthConfigured() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace-with-a-long-development-secret') {
    throw new DomainError('AUTH_NOT_CONFIGURED', 'Authentication is not configured on the server', 503);
  }
}

export async function registerUser({ email, displayName, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new DomainError('INVALID_EMAIL', 'Enter a valid email address', 422);
  }
  if (typeof displayName !== 'string' || displayName.trim().length < 2) {
    throw new DomainError('INVALID_DISPLAY_NAME', 'Display name must be at least 2 characters', 422);
  }
  if (typeof password !== 'string' || password.length < 8) {
    throw new DomainError('INVALID_PASSWORD', 'Password must be at least 8 characters', 422);
  }

  assertAuthConfigured();

  const existing = await User.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    throw new DomainError('EMAIL_ALREADY_REGISTERED', 'An account with this email already exists', 409);
  }

  const { salt, hash } = await hashPassword(password);
  try {
    const user = await User.create({
      email: normalizedEmail,
      displayName: displayName.trim(),
      passwordSalt: salt,
      passwordHash: hash,
    });
    return { token: createAccessToken(user), user: serializeUser(user) };
  } catch (error) {
    if (error?.code === 11000) {
      throw new DomainError('EMAIL_ALREADY_REGISTERED', 'An account with this email already exists', 409);
    }
    throw error;
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (typeof password !== 'string' || password.length === 0) {
    throw new DomainError('INVALID_CREDENTIALS', 'Email or password is incorrect', 401);
  }
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash +passwordSalt');

  if (!user || !user.active || !(await verifyPassword(password ?? '', user.passwordSalt, user.passwordHash))) {
    throw new DomainError('INVALID_CREDENTIALS', 'Email or password is incorrect', 401);
  }

  return { token: createAccessToken(user), user: serializeUser(user) };
}

export async function getAuthenticatedUser(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new DomainError('AUTH_USER_NOT_FOUND', 'Your session is no longer valid', 401);
  }
  const user = await User.findOne({ _id: userId, active: true }).lean();
  if (!user) {
    throw new DomainError('AUTH_USER_NOT_FOUND', 'Your session is no longer valid', 401);
  }
  return serializeUser(user);
}
