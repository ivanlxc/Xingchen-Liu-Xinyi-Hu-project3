import User from '../db/schema/user.schema.js';

export function getUserIdFromCookie(req) {
  return req.signedCookies?.userId || null;
}

export async function loadUserFromCookie(req) {
  const userId = getUserIdFromCookie(req);
  if (!userId) return null;
  try {
    return await User.findById(userId);
  } catch {
    return null;
  }
}

export async function requireAuth(req, res, next) {
  const user = await loadUserFromCookie(req);
  if (!user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  req.user = user;
  next();
}
