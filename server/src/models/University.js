import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    commission: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const University = mongoose.model('University', universitySchema);
export default University;
