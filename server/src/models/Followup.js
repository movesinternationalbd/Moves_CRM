import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    followup_date: { type: Date, required: true },
    notes: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Followup = mongoose.model('Followup', followupSchema);
export default Followup;
