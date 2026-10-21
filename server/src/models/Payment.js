import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    payment_date: { type: Date, required: true },
    payment_type: {
      type: String,
      enum: ['tuition', 'visa_fee', 'processing', 'other'],
      default: 'tuition',
    },
    method: { type: String, trim: true },
    reference: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
