const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Session = require('./models/Session');
const Settings = require('./models/Settings');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n🔌 Connected to MongoDB.\n');

    console.log('═══════════════════════════════════════════');
    console.log('   ATTENDLY AI — Fresh Database Setup');
    console.log('═══════════════════════════════════════════\n');

    const name = await ask('👤 Admin Name (e.g. Dr. John Smith): ');
    const email = await ask('📧 Admin Email: ');
    const password = await ask('🔑 Admin Password: ');
    const department = await ask('🏢 Department (e.g. Computer Science): ');

    if (!name || !email || !password) {
      console.log('\n❌ Name, email, and password are required. Aborting.');
      process.exit(1);
    }

    console.log('\n⚠️  This will PERMANENTLY delete ALL existing data:');
    console.log('   • All students');
    console.log('   • All attendance records');
    console.log('   • All sessions');
    console.log('   • All settings');
    console.log('   • All user accounts\n');

    const confirm = await ask('Type "RESET" to confirm: ');

    if (confirm !== 'RESET') {
      console.log('\n❌ Reset cancelled. No changes were made.');
      process.exit(0);
    }

    console.log('\n🗑️  Clearing all collections...');
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Session.deleteMany({});
    await Settings.deleteMany({});
    console.log('   ✅ All data cleared.');

    console.log('\n👨‍🏫 Creating admin teacher account...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      department: department || 'General',
      avatar: ''
    });

    await Settings.create({
      userId: teacher._id,
      recognitionThreshold: 80,
      autoMarkTime: '09:30',
      cameraResolution: '1080p',
      notifications: true,
      emailDigest: true,
      theme: 'dark'
    });

    console.log('   ✅ Admin account created.\n');

    console.log('═══════════════════════════════════════════');
    console.log('   ✅ DATABASE RESET COMPLETE');
    console.log('═══════════════════════════════════════════');
    console.log(`\n   Login with:`);
    console.log(`   📧 Email:    ${email}`);
    console.log(`   🔑 Password: ${password}\n`);
    console.log('   You can now register students via the app.');
    console.log('═══════════════════════════════════════════\n');

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Reset failed:', error.message);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

resetDatabase();
