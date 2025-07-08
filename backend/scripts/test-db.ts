#!/usr/bin/env node

import { DatabaseConnection, config } from '../common';

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  console.log(`📡 Connecting to: ${config.database.uri}/${config.database.name}`);
  
  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    
    console.log('✅ MongoDB connection successful!');
    console.log(`🔗 Database: ${config.database.name}`);
    console.log(`🏢 Environment: ${config.server.env}`);
    
    await dbConnection.disconnect();
    console.log('✅ Disconnected successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
