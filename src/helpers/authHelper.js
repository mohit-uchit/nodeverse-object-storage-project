const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto')

const createAccessToken = userId => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '200m',
  });
};

const createRefreshToken = userId => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const generateOtp = async() => {
   return crypto.randomInt(100000, 1000000).toString()

   // 6 digit => 100000 min , 1000000 max ( 999999)
}

module.exports = {
   createAccessToken,
   createRefreshToken,
   generateOtp
}
