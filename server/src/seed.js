import mongoose from 'mongoose';
import User from '../models/User.js';
import Country from '../models/Country.js';
import Lead from '../models/Lead.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Country.deleteMany({});
    await Lead.deleteMany({});

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@movescrm.com',
      password: 'password',
      role: 'super_admin',
    });
    const counsellor = await User.create({
      name: 'Counsellor',
      email: 'counsellor@movescrm.com',
      password: 'password',
      role: 'counsellor',
    });

    const bd = await Country.create({ name: 'Bangladesh', code: 'BD' });
    const usa = await Country.create({ name: 'USA', code: 'US' });
    const uk = await Country.create({ name: 'UK', code: 'GB' });

    await Lead.create({
      student_name: 'Rahim Ahmed',
      phone: '+8801700000001',
      email: 'rahim@example.com',
      country: bd._id,
      lead_status: 'new',
      assigned_counsellor: counsellor._id,
      created_by: admin._id,
    });
    await Lead.create({
      student_name: 'Karim Hossain',
      phone: '+8801700000002',
      email: 'karim@example.com',
      country: usa._id,
      lead_status: 'contacted',
      assigned_counsellor: counsellor._id,
      created_by: admin._id,
    });

    console.log('Database seeded successfully');
    console.log('Admin: admin@movescrm.com / password');
    console.log('Counsellor: counsellor@movescrm.com / password');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
