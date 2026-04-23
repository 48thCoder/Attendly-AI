const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const fixPassword = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Varun@123', salt);
  
  await User.updateOne({ email: 'varunrawat123@gmail.com' }, { password: hash });
  console.log('Password fixed for varunrawat123@gmail.com');
  
  await mongoose.connection.close();
};

fixPassword();
