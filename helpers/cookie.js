import { serialize, parse } from 'cookie';

/**
 * Sets a cookie on the response object with the given key, value, and options.
 *
 * @param {Object} res - The response object.
 * @param {string} key - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} [options={}] - Additional options for setting the cookie.
 * @param {number} [options.maxAge=86400] - The maximum age of the cookie in seconds (1 day by default).
 * @returns {void}
 */
export const setCookie = (res, key, value, options = {}) => {
  const cookie = serialize(key, value, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: options.maxAge || 86400,
    path: '/',
    ...options,
  });
  res.setHeader('Set-Cookie', cookie);
};

/**
 * Removes a cookie by setting its expiration date to the past.
 *
 * @param {Object} res - The response object.
 * @param {string} key - The name of the cookie to remove.
 * @returns {void}
 */
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

/**
 * Retrieves the value of a cookie from the request headers.
 *
 * @param {Object} req - The request object.
 * @param {string} key - The name of the cookie to retrieve.
 * @returns {string|null} The value of the cookie, or null if the cookie is not found.
 */
export const getCookie = (req, key) => {
  const cookies = req.headers.cookie || '';
  return parse(cookies)[key] || null;
};
