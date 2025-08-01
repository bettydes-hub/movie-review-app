const app = require('./app');
require('dotenv').config();
const { sequelize } = require('./config/db');
const initializeDatabase = require('./config/initDb');
const seedDatabase = require('./seeders/databaseSeeder');
const PORT = process.env.PORT || 3000;

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting server...');
    
    // Initialize database first
    console.log('📊 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Sync models
    console.log('🔄 Syncing models...');
    await sequelize.sync();
    console.log('✅ All models were synchronized successfully.');
    
    // Seed database with categories and users
    console.log('🌱 Seeding database with categories and users...');
    await seedDatabase();
    console.log('✅ Database seeded successfully.');
    
    // Start server
    console.log('🌐 Starting HTTP server...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend should be running on ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api`);
      console.log(`🔗 API also available at http://127.0.0.1:${PORT}/api`);
      console.log(`🔑 Admin Login: admin@movieapp.com / admin123`);
      console.log(`🧪 Test URLs:`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Users: http://localhost:${PORT}/api/test-users`);
      console.log(`✅ Server startup completed successfully!`);
    });
    
    // Handle server errors
    app.on('error', (error) => {
      console.error('❌ Server error:', error.message);
      if (error.code === 'EADDRINUSE') {
        console.log('💡 Port 3000 is already in use. Try:');
        console.log('   1. Kill the process using port 3000');
        console.log('   2. Or change PORT in .env file');
      }
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

startServer();