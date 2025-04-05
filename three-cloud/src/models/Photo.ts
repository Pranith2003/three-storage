import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  ownerWallet: String,
  cid: String,
  description: String,
  isPrivate: Boolean,
  uploadedAt: Date,
});

const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
export default Photo;
