const mongoose = require('mongoose');
const { objectStatus } = require('../../config/constants');

const objectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    bucket: { type: String, index: true, required: true },
    key: { type: String, required: true, index: true },
    blobId: { type: String, unique: true, required: true, index : true },
    size: Number,
    mimeType: String,
    metadata: mongoose.Schema.Types.Mixed,
    status: { type: Number, enum: [0, 1, 2], default: 0, index: true }, //     0: 'pending',1: 'active', 2: 'deleted',
  },
  { timestamps: true },
);

objectSchema.index({ bucket: 1, key: 1, userId  :1 }, { unique: true });

module.exports = mongoose.model('Object', objectSchema);
