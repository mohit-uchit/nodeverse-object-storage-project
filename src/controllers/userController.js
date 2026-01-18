const userService = require('../services/user/userService');
const responseHandle = require('../helpers/responseHandle');
const { createRefreshToken } = require('../helpers/authHelper');
const redis = require('../config/redis');

const createUser = async (req, res) => {
  try {
    const data = await userService.createUser(req.body);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

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

const rotateToken = async (req, res) => {
  try {
    const data = await userService.rotateToken(req.cookies.refreshToken);
    return responseHandle.handleData(res, data);
  } catch (error) {
    error.status = 403;
    return responseHandle.handleError(res, error);
  }
};

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

const getUser = async (req, res) => {
  try {
    const data = await userService.getUser(req.userId);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

const sendOtp = async (req, res) => {
  try {
     await userService.sendOtp(req.body.email);
    return responseHandle.handleOK(res, undefined, 'Otp Sent Successfully');
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

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
