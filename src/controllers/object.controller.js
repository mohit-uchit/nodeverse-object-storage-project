
const responseHandle = require('../helpers/responseHandle');
const storageService = require('../services/storage/storage.service')

/**
 * Controller: Initialize file upload
 * Creates a blob entry in database and generates a presigned URL token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.userId - User ID from auth middleware
 * @param {Object} req.body - Request body containing bucket, key, mimeType, metadata
 * @param {string} req.body.bucket - Storage bucket name
 * @param {string} req.body.key - File key/path in bucket
 * @param {string} req.body.mimeType - MIME type of the file
 * @param {Object} [req.body.metadata] - Optional metadata for the file
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with presignedUrl
 */
const initUpload = async (req, res) => {
  try {
    const data = await storageService.initUpload(req.userId, req.body);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Upload file to blob storage
 * Writes the file stream to disk using the presigned token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.token - Presigned upload token
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with file object data
 */
const upload = async (req, res) => {
  try {
    const data = await storageService.upload(req.params.token, req);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Get presigned download URL for a file
 * Retrieves file metadata and generates a time-limited download token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.userId - User ID from auth middleware
 * @param {string} req.query.bucket - Storage bucket name
 * @param {string} req.query.key - File key/path in bucket
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with downloadUrl
 */
const getObject = async (req, res) => {
  try {
    const data = await storageService.getObject(req.userId, req.query.bucket, req.query.key);
    return responseHandle.handleData(res, data);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};

/**
 * Controller: Download file from blob storage
 * Streams the file directly to the client with appropriate headers
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.token - Presigned download token
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Pipes file stream to response
 */
const downloadFile = async (req, res) => {
  try {
    const { stream, mimeType } = await storageService.downloadFile(req.params.token);
    res.setHeader('Content-Type', mimeType)
    stream.pipe(res)
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};


module.exports = {
  initUpload,
  upload,
  getObject,
  downloadFile
};
