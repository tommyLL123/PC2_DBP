const TOKEN_KEY = 'studytrack.token';
const USERNAME_KEY = 'studytrack.username';

export function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function readStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function persistSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function onSessionExpired(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

export function notifySessionExpired() {
  unauthorizedHandler?.();
}
