const router = require('express').Router();
const env = process.env.NODE_ENV || 'development';
require('dotenv').config();
const responseHandle = require('./src/helpers/responseHandle');
const responseCode = require('./src/helpers/responseCode.js');
const { connectDb } = require('./src/models/index.js');
// Routes
const storageRoutes = require('./src/routes/storageRoutes.js')
const userRoutes = require('./src/routes/userRoutes.js');

connectDb(process.env.MONGO_URI);

router.use('/storage', storageRoutes);
router.use('/users', userRoutes);

router.get('/', function (req, res) {
  return responseHandle.responseWithoutData(
    res,
    responseCode.OK,
    'Welcome to Nodeverse Course!',
  );
});

router.use(function (req, res, next) {
  return responseHandle.responseWithError(
    res,
    responseCode.NOT_FOUND,
    'Route Not Found!',
  );
});

module.exports = router;
