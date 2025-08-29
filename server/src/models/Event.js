import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    category: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);

