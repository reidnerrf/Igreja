import mongoose from 'mongoose';

const ChurchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    responsible: { type: String },
    pixKey: { type: String },
    premium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Church', ChurchSchema);

