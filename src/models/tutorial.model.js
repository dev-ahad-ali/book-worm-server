import mongoose from 'mongoose';

const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
    },

    description: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Tutorial', tutorialSchema);
