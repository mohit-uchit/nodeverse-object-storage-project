/**
 * Middleware: JWT Authentication
 * Verifies JWT access token and extracts userId to request object
 * Allows next middleware/controller to proceed if token is valid
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if authenticated, sends error response otherwise
 * @example
 * // In routes: router.get('/protected', auth, controller)
 * // Sets req.userId from JWT payload
 */
const jwt = require('jsonwebtoken');
const responseHandle = require('../helpers/responseHandle');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return responseHandle.handleError(res, {
      status: 403,
      message: 'Please login first !!',
    });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return responseHandle.handleError(res, err);
    }

    req.userId = payload.userId;
  });
  next();
};

module.exports = auth;
