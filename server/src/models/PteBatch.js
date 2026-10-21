import mongoose from 'mongoose';

const pteBatchSchema = new mongoose.Schema(
  {
    batch_name: { type: String, required: true, trim: true },
    teacher: { type: String, trim: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const PteBatch = mongoose.model('PteBatch', pteBatchSchema);
export default PteBatch;
