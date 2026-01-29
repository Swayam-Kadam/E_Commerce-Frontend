const conf = {
  APIUrl: String(import.meta.env.VITE_REACT_APP_API_URL),
  ImageURL: String(import.meta.env.VITE_REACT_APP_IMAGE_URL),
  cookiePath: String(import.meta.env.VITE_REACT_APP_COOKIE_PATH),
  cookieDomain: String(import.meta.env.VITE_REACT_APP_COOKIE_DOMAIN),
  cookieExpires: String(import.meta.env.VITE_REACT_APP_COOKIE_EXPIRES),
  redirectUrl: String(import.meta.env.VITE_REACT_APP_REDIRECT_URL),
};
export default conf;
