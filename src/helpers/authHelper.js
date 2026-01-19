const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto')

/**
 * Helper: Create JWT access token
 * Generates a short-lived JWT token for user authentication (200 minutes)
 * 
 * @param {string} userId - The user ID to encode in the token
 * @returns {string} Signed JWT access token
 */
const createAccessToken = userId => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '200m',
  });
};

/**
 * Helper: Generate random OTP
 * Creates a random 6-digit OTP (100000 to 999999)
 * @async
 * @returns {Promise<string>} 6-digit OTP as string
 */
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
