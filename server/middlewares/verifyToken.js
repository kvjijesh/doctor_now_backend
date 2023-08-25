import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }
  jwt.verify(token, process.env.JWT, (err, decodedToken) => {
    if (err) {
      return next(createError(403, "Token not valid"));
    }
    res.locals.userId = decodedToken.id;
    res.locals.userRole = decodedToken.role;
    next();
  });
};
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {

      if (res.locals.userId === req.params.id || res.locals.userRole === 'user') {
        next();
      } else {
        return next(createError(403, "You are not authorized"));
      }
    });
  };
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (res.locals.userRole === 'admin') {
      next();
    } else {
      return next(createError(403, "You are not authorized as an admin"));
    }
  });
};
