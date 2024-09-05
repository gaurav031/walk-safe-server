import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: { type: [String], default: [] },
  tags: [String],
  selectedFile: String,
  picturePath: { type: String }, // Added picturePath field
  likes: { type: [String], default: [] },
  likeCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 1, // Minimum rating of 1
    max: 5, // Maximum rating of 5
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
