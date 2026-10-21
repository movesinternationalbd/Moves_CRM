import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    file_path: { type: String, trim: true },
    category: { type: String, trim: true },
    documentable_type: { type: String, trim: true },
    documentable_id: { type: mongoose.Schema.Types.Mixed },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
