import { asyncHandler } from '../utils/asyncHandler.js';
import Lead from '../models/Lead.js';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Expense from '../models/Expense.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const leadsToday = await Lead.countDocuments({ created_at: { $gte: startOfMonth } });
  const studentsTotal = await Student.countDocuments({});
  const revenueMonth = await Payment.aggregate([
    { $match: { status: 'completed', payment_date: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const expensesMonth = await Expense.aggregate([
    { $match: { expense_date: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  res.json({
    success: true,
    stats: {
      leads_month: leadsToday,
      students_total: studentsTotal,
      revenue_month: revenueMonth[0]?.total || 0,
      expenses_month: expensesMonth[0]?.total || 0,
    },
  });
});
