const { Sequelize } = require('sequelize');
require('dotenv').config();

// First, connect to PostgreSQL without specifying a database
const initSequelize = new Sequelize('postgres', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false
});

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Test connection to PostgreSQL
    await initSequelize.authenticate();
    console.log('✅ Connected to PostgreSQL server');
    
    // Check if database exists
    try {
      const [results] = await initSequelize.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        {
          bind: [process.env.DB_NAME],
          type: Sequelize.QueryTypes.SELECT
        }
      );
      
      if (results && results.length > 0) {
        console.log(`✅ Database '${process.env.DB_NAME}' already exists`);
      } else {
        console.log(`📝 Creating database '${process.env.DB_NAME}'...`);
        await initSequelize.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
        console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Database '${process.env.DB_NAME}' already exists (handled gracefully)`);
      } else {
        throw error;
      }
    }
    
    await initSequelize.close();
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Database already exists - continuing...');
    } else {
      console.error('❌ Database initialization failed:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('password authentication failed')) {
        console.log('\n💡 Possible solutions:');
        console.log('1. Check your PostgreSQL password in .env file');
        console.log('2. Make sure PostgreSQL is running');
        console.log('3. Try using default password: postgres');
      } else if (error.message.includes('connection refused')) {
        console.log('\n💡 Possible solutions:');
        console.log('1. Make sure PostgreSQL is installed and running');
        console.log('2. Check if PostgreSQL is running on port 5432');
        console.log('3. Try starting PostgreSQL service');
      }
    }
  }
}

module.exports = initializeDatabase; 