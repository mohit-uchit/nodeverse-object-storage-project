const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const verifyOtpRateLimiter = require('../middlewares/otpRateLimit')

router.post('/register', userController.createUser)

router.post('/login', userController.loginUser);

router.get('/refresh', userController.rotateToken)

router.delete('/logout', auth, userController.logout)

router.get('/', auth, userController.getUser)

router.post('/getOtp', userController.sendOtp)

router.post('/verify', userController.verifyOtp)

module.exports = router