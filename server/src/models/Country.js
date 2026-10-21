import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
  },
  { timestamps: true }
);

const Country = mongoose.model('Country', countrySchema);
export default Country;
