const { createBlob, writeBlob } = require('./blobStore.service');
const ObjectModel = require('../../models/object/object.model');
const { getKeyByValue } = require('../../helpers/commonHelper');
const { objectStatus : statusConst } = require('../../config/constants');
const singer = require('../security/signer.service')

const initUpload = async (userId,   data) => {
   const {blobId , path } =  createBlob();
   
   await ObjectModel.create({
      userId, 
      bucket : data.bucket,
      key : data.key,
      blobId,
      mimeType : data.mimeType,
      metadata : data.metadata,
      status : getKeyByValue(statusConst, 'pending')
   })

   const token = singer.signToken({ blobId }, 300)
   return { presignedUrl : `/api/storage/upload/${token}`}
}

const upload = async (token, stream) => {
  console.log('===================', token)
    const { blobId } = singer.verifyToken(token);
    console.log('===================', blobId)
    const obj = await ObjectModel.findOne({blobId});
    if(!obj){
       throw new Error('Object not found!!')
    }
    
    const filePath = createBlob(blobId).path

    console.log(filePath)

    await writeBlob(filePath, stream);

    obj.status = getKeyByValue(statusConst, 'active');

    return obj.save()
}

module.exports = { 
  initUpload,
  upload
}