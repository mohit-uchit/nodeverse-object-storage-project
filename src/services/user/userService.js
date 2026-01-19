const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../../models/user/user');
const bcrypt = require('bcrypt');
const {
  createAccessToken,
  createRefreshToken,
  generateOtp,
} = require('../../helpers/authHelper');
const redis = require('../../config/redis');
const mailer = require('../../config/mail');

/**
 * Service: Create new user account
 * Hashes password and creates user document in database
 * 
 * @async
 * @param {Object} data - User registration data
 * @param {string} data.name - User's full name
 * @param {string} data.email - User's email address
 * @param {string} data.password - User's password (will be hashed)
 * @returns {Promise<Object>} Object with user id
 * @throws {Error} If user already exists or database error occurs
 */
const createUser = async data => {
  const { name, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ email }, { _id: 1 });

  if (existingUser) {
    throw new Error('User already Exists!!!');
  }
  const user = await User.create({ name, email, password: hashedPassword });
  return {
    id: user._id,
  };
};

/**
 * Service: Authenticate user login
 * Verifies email and password, returns access token
 * 
 * @async
 * @param {Object} data - Login credentials
 * @param {string} data.email - User's email address
 * @param {string} data.password - User's password
 * @returns {Promise<Object>} Object with userId and accessToken
 * @throws {Error} If user not found or credentials invalid
 */
const loginUser = async data => {
  const { email, password } = data;

  const user = await User.findOne(
    { email: email.toLowerCase() },
    { password: 1 },
  );

  if (!user) {
    throw new Error('User not found!!!');
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    throw new Error('Invalid Credentials');
  }

  const accessToken = createAccessToken(user.id);

  return {
    userId: user.id,
    accessToken,
  };
};

/* const getUserById = async id => {
   const user = await User.findById(id, {name : 1, age: 1, email: 1}).populate('addresses')
   return {
     id : user._id,
     name : user.name,
     age : user.age,
     email: user.email,
     addresses : user.addresses.map(a =>  {
       return {
         id : a._id,
         streeAddress : a.street,
         city : a.city
     }
     })
   }
};

const getUsers = async query => {};

const updateUser = async data => {};

const deleteUser = async id => {}; */

const rotateToken = async refreshToken => {
  if (!refreshToken) {
    throw new Error('Unautorized Access!!');
  }

  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, data) => {
      if (err) {
        throw new Error('Unauthorized!');
      }

      const savedToken = await redis.get(data.userId);

      if (!savedToken) {
        throw new Error('Unautorized Access!');
      }

      const newAccessToken = createAccessToken(data.userId);

      return {
        accessToken: newAccessToken,
      };
    },
  );
};

/**
 * Service: User logout
 * Removes refresh token from Redis cache
 * 
 * @async
 * @param {string} refreshToken - The refresh token to invalidate
 * @returns {Promise<number>} Number of keys deleted from Redis
 * @throws {Error} If token invalid or expired
 */
const logout = async refreshToken => {
  if (!refreshToken) {
    throw new Error('Unauthorized Access!!');
  }
/**
 * Service: Get user profile
 * Retrieves user information by ID
 * 
 * @async
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} User document from database
 * @throws {Error} If user not found
 */

  const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (!data) {
    throw new Error('Unauthorized Acess');
  }
  return redis.del(data.userId);
};

const getUser = async userId => {
  return await User.findById(userId);
};

const sendOtp = async userEmail => {
  const user = await User.findOne(
    { email: userEmail },
    { _id: 1, emailVerified: 1 },
  );
  if (user.emailVerified === true) {
    throw new Error('Email already Verified!!');
  }
  const otp = await generateOtp();
  const otpString = otp.toString();
  const hashedOtp = await bcrypt.hash(otpString, 10);

  if (!user) {
    throw new Error('User does not exist!!');
  }

  await redis.set(`otp:${userEmail}`, hashedOtp, { EX: 120 });
  return mailer.sendMail({
    from: 'Node Verse <no-reply@mohituchit.xyz>',
    to: userEmail,
    subject: 'Your Login OTP - Node Verse',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Login OTP</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:0 auto;">
    <tr>
      <td style="padding:40px 20px; text-align:center; background-color:#ffffff;">
        <!-- Logo or Brand Name -->
        <h1 style="font-size:24px; color:#333333; margin:0 0 30px;">Node Verse</h1>
        
        <p style="font-size:16px; color:#555555; line-height:1.5;">Hello,</p>
        <p style="font-size:16px; color:#555555; line-height:1.5; margin:20px 0;">
          Use the following One-Time Password (OTP) to complete your secure login. 
          It is valid for the next <strong>10 minutes</strong>.
        </p>
        
        <!-- Prominent OTP Box -->
        <div style="margin:40px auto; text-align:center;">
          <p style="font-size:36px; letter-spacing:8px; font-weight:bold; color:#333333; background-color:#f0f0f0; padding:20px; border-radius:8px; display:inline-block; border:2px dashed #cccccc;">
             ${otp}
          </p>
        </div>
        
        <p style="font-size:14px; color:#777777; line-height:1.5; margin:30px 0;">
          <strong>Do not share this OTP with anyone.</strong> If you didn't request this, please ignore this email or contact support.
        </p>
        
        <p style="font-size:16px; color:#555555; line-height:1.5;">
          Thank you,<br>
          The Node Verse Team
        </p>
        
        <hr style="border:none; border-top:1px solid #eeeeee; margin:40px 0;">
        
        <p style="font-size:12px; color:#999999; text-align:center;">
          © 2026 Node Verse. All rights reserved.<br>
          If you have any questions, reply to this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  });
};

const verifyOtp = async body => {
  const { otp, email } = body;
  const key = `otp_attemps:${email}`;
  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, 10 * 60);
  }

  if (attempts > 5) {
    throw new Error('Too many attempts');
  }

  const hashedOtp = await redis.get(`otp:${email}`);
  if (!hashedOtp) {
    throw new Error('Otp is expired!!');
  }

  const isMatch = await bcrypt.compare(otp, hashedOtp);

  if (!isMatch) {
    throw new Error('Incorrect Otp!');
  }

  await redis.del(`otp:${email}`);

  const user = await User.findOne({ email }, { emailVerified: 1 });
  if (!user) {
    throw new Error('User not found!!');
  }
  await User.updateOne({ email }, { emailVerified: true });
};
module.exports = {
  createUser,
  loginUser,
  rotateToken,
  logout,
  getUser,
  sendOtp,
  verifyOtp,
};
