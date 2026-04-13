import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    source: { type: String },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    publishedAt: { type: Date, required: true },
    prediction: {
      type: String,
      enum: ['Real', 'Fake', 'Misleading', 'Uncertain', 'Pending'],
      default: 'Pending',
    },
    confidenceScore: { type: Number, default: 0 },
    reason: { type: String, default: '' },
    category: { type: String, default: 'General' },
    lat: { type: Number },
    lon: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model('News', newsSchema);
