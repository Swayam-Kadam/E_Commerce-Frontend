const conf = {
  APIUrl: String(import.meta.env.VITE_REACT_APP_API_URL),
  ImageURL: String(import.meta.env.VITE_REACT_APP_IMAGE_URL),
  cookiePath: String(import.meta.env.VITE_REACT_APP_COOKIE_PATH),
  cookieDomain: String(import.meta.env.VITE_REACT_APP_COOKIE_DOMAIN),
  cookieExpires: String(import.meta.env.VITE_REACT_APP_COOKIE_EXPIRES),
  redirectUrl: String(import.meta.env.VITE_REACT_APP_REDIRECT_URL),
  rozerpaykey: String(import.meta.env.VITE_REACT_APP_RAZORPAY_KEY),
};
export default conf;
