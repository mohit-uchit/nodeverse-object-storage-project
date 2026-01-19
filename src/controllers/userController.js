const userService = require('../services/user/userService');
const responseHandle = require('../helpers/responseHandle');
const { createRefreshToken } = require('../helpers/authHelper');
const redis = require('../config/redis');

/**
 * Controller: User registration
 * Creates a new user account with hashed password
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with userId
 */
const createUser = async (req, res) => {
  try {
    const data = await userService.createUser(req.body);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: User login
 * Authenticates user credentials and issues access and refresh tokens
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with accessToken, sets refreshToken cookie
 */
const loginUser = async (req, res) => {
  try {
    const data = await userService.loginUser(req.body);
    const refreshToken = createRefreshToken(data.userId);
    await redis.set(data.userId, refreshToken, {
      EX: 60 * 60 * 24 * 7,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Rotate access token
 * Generates a new access token using the refresh token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Cookies object
 * @param {string} req.cookies.refreshToken - Refresh token from cookie
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with new accessToken
 */
const rotateToken = async (req, res) => {
  try {
    const data = await userService.rotateToken(req.cookies.refreshToken);
    return responseHandle.handleData(res, data);
  } catch (error) {
    error.status = 403;
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: User logout
 * Invalidates the refresh token by removing it from Redis
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Cookies object
 * @param {string} req.cookies.refreshToken - Refresh token to invalidate
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Clears refreshToken cookie and sends success response
 */
const logout = async (req, res) => {
  try {
    await userService.logout(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    return responseHandle.handleOK(res);
  } catch (error) {
    error.status = 403;
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Get user profile
 * Retrieves authenticated user's profile information
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.userId - User ID from auth middleware
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with user data
 */
const getUser = async (req, res) => {
  try {
    const data = await userService.getUser(req.userId);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Send OTP to email
 * Generates and sends a one-time password to the user's email for verification
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends success response with message "Otp Sent Successfully"
 */
const sendOtp = async (req, res) => {
  try {
     await userService.sendOtp(req.body.email);
    return responseHandle.handleOK(res, undefined, 'Otp Sent Successfully');
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Verify OTP
 * Validates the OTP provided by the user and marks email as verified
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.otp - The OTP to verify
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends success response with message "Otp verified successfully"
 */
const verifyOtp = async (req, res) => {
  try {
     await userService.verifyOtp(req.body);
    return responseHandle.handleOK(res, undefined, 'Otp verified successfully');
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/* const updateUser = async (req, res) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    return responseHandle.handleOK(res);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const data = await userService.getUserById(req.params.id);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers(req.query);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
  } catch (error) {}
}; */

module.exports = {
  createUser,
  loginUser,
  rotateToken,
  logout,
  getUser,
  sendOtp,
  verifyOtp
};
