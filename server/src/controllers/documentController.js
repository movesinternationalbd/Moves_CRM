import { asyncHandler } from '../utils/asyncHandler.js';
import Document from '../models/Document.js';

export const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({}).populate('uploaded_by').sort({ created_at: -1 });
  res.json({ success: true, documents });
});

export const createDocument = asyncHandler(async (req, res) => {
  const document = await Document.create({ ...req.body, uploaded_by: req.user._id });
  res.status(201).json({ success: true, document });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
  await document.deleteOne();
  res.json({ success: true, message: 'Document removed' });
});
