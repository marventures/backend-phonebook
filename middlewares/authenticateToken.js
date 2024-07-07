import jwt from 'jsonwebtoken';
import { User } from '../models/usersModel.js';
import { httpError } from '../helpers/httpError.js';
import { getCookie } from '../helpers/cookie.js';
import 'dotenv/config';

const { SECRET_KEY } = process.env;

/**
 * Middleware to authenticate a user based on the JWT token from the Authorization header or cookies.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request.
 * @param {string} req.headers.authorization - The Authorization header containing the Bearer token.
 * @param {Object} req.cookies - The cookies of the request.
 * @param {Object} _res - The response object (not used).
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if the token is missing, invalid, or the user is not authorized.
 */
const authenticateToken = async (req, _res, next) => {
  try {
    // Check the Authorization header
    const [bearer, token] = req.headers.authorization.split(' ');

    if (bearer !== 'Bearer') {
      next(httpError(401, 'Not authorized'));
    }

    // If no token is found in the Authorization header, check cookies
    if (!token) {
      token = getCookie(req, 'jwt_token');
    }

    if (!token) {
      console.log('No token found in Authorization header or cookies');
      return next(httpError(401, 'Not authorized'));
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(httpError(401, 'Not authorized'));
    }

    if (user.token !== token) {
      return next(httpError(401, 'Not authorized'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(httpError(401, 'Not authorized'));
  }
};

export { authenticateToken };
