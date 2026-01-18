// req , res , next
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
