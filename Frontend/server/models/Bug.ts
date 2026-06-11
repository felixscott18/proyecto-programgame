import mongoose from 'mongoose';

const BugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
  createdBy: {
    type: String, // Can be user ID, email, or username
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Bug: mongoose.Model<any> = mongoose.models.Bug || mongoose.model('Bug', BugSchema);
export default Bug;
