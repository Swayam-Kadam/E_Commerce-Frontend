import cookies from 'js-cookie';
import { cookieKeys } from '@/services/cookies';
import routesConstants from '@/routes/routesConstants';

export function isAuthenticated() {
  return Boolean(cookies.get(cookieKeys.TOKEN));
}

/** Build an internal-only login URL with optional return path */
export function buildLoginPath(redirectPath) {
  const safe = getSafeRedirectPath(redirectPath, null);
  if (!safe) {
    return routesConstants.LOGIN;
  }
  return `${routesConstants.LOGIN}?redirect=${encodeURIComponent(safe)}`;
}

/** Validate redirect target — must be same-origin relative path */
export function getSafeRedirectPath(redirectParam, fallback = routesConstants.HOMEPAGE) {
  if (!redirectParam || typeof redirectParam !== 'string') {
    return fallback;
  }

  const path = redirectParam.trim();
  if (!path.startsWith('/') || path.startsWith('//')) {
    return fallback;
  }
  if (path.startsWith(routesConstants.LOGIN) || path.startsWith(routesConstants.SIGNUP)) {
    return fallback;
  }

  return path;
}

/** Redirect guest to login for a protected action */
export function requireAuth(navigate, currentPath, message) {
  navigate(buildLoginPath(currentPath));
  return message;
}
