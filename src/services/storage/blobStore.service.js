const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '../../../blob-store');
/**
 * Create or reference a blob file
 * Generates a new blobId if not provided, creates directory structure (first 2 hex chars as dir)
 * 
 * @param {string} [blobId] - Optional existing blob ID. If not provided, generates new one
 * @returns {Object} Object containing blobId and full file path
 * @returns {string} Object.blobId - The blob identifier
 * @returns {string} Object.path - Full file system path to the blob
 * @example
 * const { blobId, path } = createBlob();
 * // Returns { blobId: 'a1b2c3...', path: '/blob-store/a1/a1b2c3....blob' }
 */
const createBlob = blobId => {
   if (!blobId) {
      blobId = crypto.randomBytes(16).toString('hex');
   }
   const dir = path.join(root, blobId.slice(0, 2));
   fs.mkdirSync(dir, { recursive: true });

   return {
      blobId: blobId,
      path: path.join(dir, `${blobId}.blob`),
   };
};

/**
 * Write file stream to disk
 * Pipes the incoming stream to a write stream and handles completion/errors
 * 
 * @async
 * @param {string} filePath - Full path where file should be written
 * @param {Object} stream - Readable stream to write to disk
 * @returns {Promise<void>} Resolves when write is complete
 * @throws {Error} If write stream encounters error
/**
 * Read blob file from disk
 * Returns a readable stream for the file or null if file doesn't exist
 * 
 * @param {string} filePath - Full path to the blob file
 * @returns {Object|null} Readable stream for the file or null if file not found
 */
const writeBlob = async (filePath, stream) => {
   return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(filePath);
     stream.pipe(ws);
     ws.on('finish', resolve);
     ws.on('error', reject);
  });
};

const readBlob = filePath => {
   /**
    * Get blob file path information
    * Constructs and validates the full path for a blob file
    * 
    * @param {string} blobId - The blob identifier
    * @returns {Object} Object with directory and file path
    * @returns {string} Object.dir - Directory path (first 2 hex chars)
    * @returns {string} Object.filePath - Full file path
    * @throws {Error} If file doesn't exist at expected location
    */
   const exists = fs.existsSync(filePath);
   if (!exists) {
      return null;
   }
   return fs.createReadStream(filePath);
};

const getBlobPath = blobId => {
   const dir = path.join(root, blobId.slice(0, 2));

   const filePath = path.join(dir, `${blobId}.blob`);

   if (!fs.existsSync(filePath)) {
      throw new Error('File does not exists');
   }
   return { dir, filePath };
};

module.exports = {
  createBlob,
  writeBlob,
   readBlob,
   getBlobPath,
};
