import { serialize, parse } from 'cookie';

// Set cookie function
export const setCookie = (res, key, value, options = {}) => {
  const cookie = serialize(key, value, {
    httpOnly: true, // Ensures the cookie is not accessible via JavaScript
    path: '/',
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Protects against CSRF
    maxAge: options.maxAge || 86400, // Max age in seconds (1 day by default)
    path: '/', // Allow the cookie to be sent on any request path
    ...options,
  });
  res.setHeader('Set-Cookie', cookie);
};

// Remove cookie function
export const removeCookie = (res, key) => {
  const cookie = serialize(key, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0), // Set expiration to past to delete the cookie
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
};

// Get cookie function
export const getCookie = (req, key) => {
  const cookies = req.headers.cookie || '';
  return parse(cookies)[key] || null;
};
