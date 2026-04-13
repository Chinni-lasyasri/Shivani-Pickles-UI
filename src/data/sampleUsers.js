/**
 * Sample Users for Development / Testing
 * ----------------------------------------
 * 2 Admin users  → role: 'admin'
 * 3 Normal users → role: 'user'
 *
 * Fields match the login form: mobile (10-digit Indian) + password.
 * Seed these into your backend DB or use them for mock auth during dev.
 */

export const sampleUsers = [
  // ── Admins ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Shivani Sharma',
    mobile: '9390862744',
    password: 'Admin@1234',
    email: 'shivani@shivanipickles.com',
    role: 'admin',
    avatar: '👩‍💼',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    mobile: '9876543211',
    password: 'Admin@5678',
    email: 'rajesh@shivanipickles.com',
    role: 'admin',
    avatar: '👨‍💼',
  },

  // ── Normal Users ───────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Priya Patel',
    mobile: '6300142545',
    password: 'User@1234',
    email: 'priya.patel@gmail.com',
    role: 'user',
    avatar: '👩',
  },
  {
    id: 4,
    name: 'Amit Verma',
    mobile: '9123456781',
    password: 'User@5678',
    email: 'amit.verma@gmail.com',
    role: 'user',
    avatar: '👨',
  },
  {
    id: 5,
    name: 'Meena Nair',
    mobile: '9123456782',
    password: 'User@9012',
    email: 'meena.nair@gmail.com',
    role: 'user',
    avatar: '👩‍🦱',
  },
];

/**
 * Quick lookup by mobile number (mirrors how the login form works).
 * Usage:
 *   import { findUserByMobile } from '../data/sampleUsers';
 *   const user = findUserByMobile('9876543210');
 */
export const findUserByMobile = (mobile) =>
  sampleUsers.find((u) => u.mobile === mobile) || null;

/**
 * Mock login function — use this if the backend isn't running yet.
 * Returns a fake JWT-like object when credentials match, throws otherwise.
 *
 * Usage in Login.js (password mode):
 *   import { mockLogin } from '../data/sampleUsers';
 *   const data = mockLogin(mobile, password);
 *   localStorage.setItem('token', data.access_token);
 *   localStorage.setItem('user', JSON.stringify(data.user));
 */
export const mockLogin = (mobile, password) => {
  const user = findUserByMobile(mobile);
  if (!user || user.password !== password) {
    throw new Error('Invalid mobile number or password.');
  }
  const { password: _pw, ...safeUser } = user; // strip password before storing
  return {
    access_token: `mock-token-${user.id}-${Date.now()}`,
    user: safeUser,
  };
};
