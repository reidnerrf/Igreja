import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    name: { type: String },
    role: { type: String, enum: ['user', 'church'], required: true },
    avatarUrl: { type: String },
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
    premium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

