const crypto = require('crypto');

const secretKey =
  'asdfasdfasdfklasdjfklasdjfkladsjfklasdjfkl;sadjfkl;sdjfkl;dsajfkl;sad;jfewoiruweoiruldfdjsafljsda';

/**
 * Sign token with HMAC signature
 * Creates a tamper-proof token with JSON payload, expiry, and HMAC-SHA256 signature
 * Encodes result in base64 for safe transmission
 * 
 * @param {Object} payload - Data to encode in token
 * @param {number} ttlSec - Time-to-live in seconds
 * @returns {string} Base64-encoded signed token
 * @example
 * const token = signToken({ blobId: '123abc' }, 300);
 * // Token valid for 300 seconds
 */
const signToken = (payload, ttlSec) => {
  const expiry = Date.now() + ttlSec * 1000;
  const data = JSON.stringify({ payload, expiry });
  const sig = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
  return Buffer.from(`${data}.${sig}`).toString('base64');
};

/**
 * Verify token signature and expiry
 * Decodes base64 token, validates HMAC signature, and checks expiration
 * 
 * @param {string} token - Base64-encoded signed token
 * @returns {Object} Decoded payload if token is valid
 * @throws {Error} If signature invalid or token expired
 */
const verifyToken = token => {
  const decoded = Buffer.from(token, 'base64').toString();

  const [data, sig] = decoded.split('.');
  const expected = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
  if (sig !== expected) {
    throw newError('Invalid Singature');
  }

  const parsed = JSON.parse(data);

  if (Date.now > parsed.expiry) {
    throw new Error('Token Expired!');
  }
  return parsed.payload;
};

module.exports = {
  signToken,
  verifyToken,
};