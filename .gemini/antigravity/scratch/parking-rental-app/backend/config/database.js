const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Database configuration and connection setup
 * Uses PostgreSQL with connection pooling for production
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'parking_rental',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Connection pool configuration for production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    
    // Timezone configuration
    timezone: '+05:30',
    
    // Define options
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('✗ Unable to connect to database:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
