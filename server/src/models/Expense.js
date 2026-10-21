import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    expense_date: { type: Date, required: true },
    description: { type: String, trim: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
