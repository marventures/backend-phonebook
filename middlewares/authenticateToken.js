import jwt from 'jsonwebtoken';
import { User } from '../models/usersModel.js';
import { httpError } from '../helpers/httpError.js';
import { getCookie } from '../helpers/cookie.js';
import 'dotenv/config';

const { SECRET_KEY } = process.env;

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
