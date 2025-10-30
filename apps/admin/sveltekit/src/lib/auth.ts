import { browser } from '$app/environment';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin';
};

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export function setSession(token: string, user: AdminUser) {
  if (!browser) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Also set a cookie so server can guard protected routes
  // Note: non-HttpOnly; used only for route guarding. Consider moving to HttpOnly via server endpoints later.
  const maxAgeDays = 7;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearSession() {
  if (!browser) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Clear cookie
  document.cookie = `${TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  if (!browser) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AdminUser | null {
  if (!browser) return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}


