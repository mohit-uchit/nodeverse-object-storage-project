const { z } = require('zod');

exports.initUploadSchema = z.object({
   bucket : z.string().min(2),
   key : z.string().min(1),
   mimeType : z.string(),
   metadata : z.object({}).passthrough().optional()
})
