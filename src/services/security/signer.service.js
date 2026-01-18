const crypto = require('crypto');

const secretKey =
  'asdfasdfasdfklasdjfklasdjfkladsjfklasdjfkl;sadjfkl;sdjfkl;dsajfkl;sad;jfewoiruweoiruldfdjsafljsda';

const signToken = (payload, ttlSec) => {
  const expiry = Date.now() + ttlSec * 1000;
  const data = JSON.stringify({ payload, expiry });
  const sig = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
  return Buffer.from(`${data}.${sig}`).toString('base64');
};

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