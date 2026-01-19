const { createBlob, writeBlob, readBlob, getBlobPath } = require('./blobStore.service');
const ObjectModel = require('../../models/object/object.model');
const { getKeyByValue } = require('../../helpers/commonHelper');
const { objectStatus: statusConst } = require('../../config/constants');
const signer = require('../security/signer.service');

/**
 * Service: Initialize file upload
 * Creates a blob entry in database with pending status and generates presigned URL token
 * 
 * @async
 * @param {string} userId - ID of the user initiating the upload
 * @param {Object} data - Upload metadata
 * @param {string} data.bucket - Storage bucket name
 * @param {string} data.key - File key/identifier in the bucket
 * @param {string} data.mimeType - MIME type of the file
 * @param {Object} [data.metadata] - Optional custom metadata
 * @returns {Promise<Object>} Object with presignedUrl for upload
 * @throws {Error} If database operation fails
 */
const initUpload = async (userId, data) => {
   const { blobId, path } = createBlob();

   await ObjectModel.create({
      userId,
      bucket: data.bucket,
      key: data.key,
      blobId,
      mimeType: data.mimeType,
      metadata: data.metadata,
      status: getKeyByValue(statusConst, 'pending'),
   });

   const token = signer.signToken({ blobId }, 300);
   return { presignedUrl: `/api/storage/upload/${token}` };
};

/**
 * Service: Upload file to blob storage
 * Writes the incoming stream to disk and updates object status to active
 * 
 * @async
 * @param {string} token - Presigned upload token containing blobId
 * @param {Object} stream - File stream from request
 * @returns {Promise<Object>} Updated object document
 * @throws {Error} If token verification fails or object not found
 */
const upload = async (token, stream) => {
   const { blobId } = signer.verifyToken(token);
   const obj = await ObjectModel.findOne({ blobId });
   if (!obj) {
      throw new Error('Object not found!!');
   }
   /**
    * Service: Get presigned download URL
    * Retrieves file metadata and generates time-limited download token
    * 
    * @async
    * @param {string} userId - ID of the user requesting download
    * @param {string} bucket - Storage bucket name
    * @param {string} key - File key in the bucket
    * @returns {Promise<Object>} Object with downloadUrl
    * @throws {Error} If file not found or access denied
    */

   const filePath = createBlob(blobId).path;

   await writeBlob(filePath, stream);

   obj.status = getKeyByValue(statusConst, 'active');

   return obj.save();
};

const getObject = async (userId, bucket, key) => {
   const obj = await ObjectModel.findOne({
      userId,
      bucket,
      key,
      status: getKeyByValue(statusConst, 'active'),
   }, { blobId: 1, mimeType: 1 });
   if (!obj) {
      throw new Error('File does not exists!!');
   }
   /**
    * Service: Download file from blob storage
    * Reads file stream from disk and returns it with MIME type
    * 
    * @async
    * @param {string} token - Presigned download token containing blobId and mimeType
    * @returns {Promise<Object>} Object with file stream and mimeType
    * @throws {Error} If token verification fails or file not found
    */

   const token = signer.signToken(
      { blobId: obj.blobId, mimeType: obj.mimeType },
      300,
   );

   return {
      downloadUrl: `http://localhost:3000/api/storage/downloads/${token}`,
   };
};

const downloadFile = async token => {
   const { blobId, mimeType } = signer.verifyToken(token);
   const { filePath } = getBlobPath(blobId);
   const stream = readBlob(filePath)
   if (!stream) {
      throw new Error('File not found!!!')
   }

   return {
      stream,
      mimeType
   }
};
module.exports = {
  initUpload,
   upload,
   getObject,
   downloadFile,
};
