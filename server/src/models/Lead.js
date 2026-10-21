import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    lead_id: { type: String, unique: true },
    student_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    intake: { type: String, trim: true },
    qualification: { type: String, trim: true },
    ielts_score: { type: Number },
    pte_score: { type: Number },
    lead_source: { type: String, trim: true },
    lead_status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'application_submitted', 'visa_applied', 'visa_granted', 'enrolled', 'lost', 'dead'],
      default: 'new',
    },
    assigned_executive: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigned_counsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
    next_followup_date: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

leadSchema.pre('save', async function (next) {
  if (!this.lead_id) {
    const count = await mongoose.model('Lead').countDocuments();
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
    this.lead_id = `LD${ymd}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
