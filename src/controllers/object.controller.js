
const responseHandle = require('../helpers/responseHandle');
const storageService = require('../services/storage/storage.service')

const initUpload = async (req, res) => {
  try {
    const data = await storageService.initUpload(req.userId, req.body);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

const upload = async (req, res) => {
  try {
    const data = await storageService.upload(req.params.token, req);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

module.exports = {
  initUpload,
  upload
};
