import jwt from 'jsonwebtoken';
import { User } from '../models/usersModel.js';
import { httpError } from '../helpers/httpError.js';
import { getCookie } from '../helpers/cookie.js';
import 'dotenv/config';

const { SECRET_KEY } = process.env;

const authenticateToken = async (req, res, next) => {
  try {
    const token = getCookie(req, 'jwt_token');

    if (!token) {
      console.log('No token found in cookies');
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
