import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    student_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    passport_no: { type: String, trim: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
    course: { type: String, trim: true },
    intake: { type: String, trim: true },
    visa_status: {
      type: String,
      enum: ['not_applied', 'applied', 'granted', 'rejected'],
      default: 'not_applied',
    },
    application_status: {
      type: String,
      enum: ['draft', 'submitted', 'accepted', 'rejected'],
      default: 'draft',
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
