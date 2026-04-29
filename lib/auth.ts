export function getTokens() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

export function setTokens(accessToken: string, refreshToken: string) {
  document.cookie = `access_token=${accessToken}; path=/; max-age=1800; SameSite=Lax`;
  document.cookie = `refresh_token=${refreshToken}; path=/; max-age=3600; SameSite=Lax`;
}

export function clearTokens() {
  document.cookie = 'access_token=; path=/; max-age=0';
  document.cookie = 'refresh_token=; path=/; max-age=0';
}