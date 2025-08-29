import mongoose from 'mongoose';

const PrayerSchema = new mongoose.Schema(
  {
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in_prayer', 'answered'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Prayer', PrayerSchema);

