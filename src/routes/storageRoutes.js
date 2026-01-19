// External Libraries
const router = require('express').Router();
// Middlewares
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
//Controller
const objectController = require('../controllers/object.controller');
//Validations
const { initUploadSchema } = require('../validations/object.validation');

router.post(
  '/init-upload',
  auth,
  validate(initUploadSchema),
  objectController.initUpload,
);

router.put('/upload/:token', objectController.upload);

router.get('/objects', auth, objectController.getObject);

router.get('/downloads/:token', objectController.downloadFile);

module.exports = router;
