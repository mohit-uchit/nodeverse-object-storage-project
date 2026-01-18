const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '../../../blob-store');

const createBlob = () => {
   const id = crypto.randomBytes(16).toString('hex');
   const dir = path.join(root, id.slice(0, 2));

   fs.mkdirSync(dir, { recursive : true});

   return {
      blobId : id,
      path : path.join(dir, `${id}.blob`)
   }
}

const writeBlob = async(filePath, stream) => {
   return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(filePath);
      stream.pipe(ws)
      ws.on('finish', resolve)
      ws.on('error', reject)
   }) 
}

const readBlob = async (filePath) => fs.createReadStream(filePath)

module.exports = {
  createBlob,
  writeBlob,
  readBlob
}