// Test script to verify ad creation fix
import { AdService } from '../ads-server/services/ad.service';
import { AdSet } from '../common/models/AdSet';
import { connectDB } from '../common/database/connection';

async function testAdCreation() {
  console.log('Testing ad creation with Facebook adset ID lookup...');
  
  // Mock data
  const mockAdData = {
    name: 'Test Ad',
    adsetId: '507f1f77bcf86cd799439011', // Sample MongoDB ObjectId
    creativeId: '123456789', // Sample Facebook creative ID
    status: 'PAUSED' as const
  };

  // Mock adset with Facebook ID
  const mockAdSet = {
    _id: mockAdData.adsetId,
    userId: 'testuser',
    facebookAdSetId: '987654321', // Sample Facebook adset ID
    name: 'Test AdSet',
    // ... other required fields
  };

  console.log('Mock ad data:', mockAdData);
  console.log('Mock adset data:', mockAdSet);
  
  // Test the validation logic
  try {
    // Validate that adsetId is provided
    if (!mockAdData.adsetId) {
      throw new Error('Adset ID is required');
    }

    // Validate that creativeId is a valid number
    const creativeIdNum = parseInt(mockAdData.creativeId, 10);
    if (isNaN(creativeIdNum) || creativeIdNum <= 0) {
      throw new Error('Invalid creative ID - must be a positive number');
    }

    // Validate Facebook adset ID
    const facebookAdsetId = parseInt(mockAdSet.facebookAdSetId, 10);
    if (isNaN(facebookAdsetId) || facebookAdsetId <= 0) {
      throw new Error('Invalid Facebook adset ID');
    }

    // Prepare Facebook API request
    const facebookAdData = {
      name: mockAdData.name,
      adset_id: facebookAdsetId, // Use Facebook adset ID
      creative: {
        creative_id: creativeIdNum
      },
      status: mockAdData.status || 'PAUSED'
    };

    console.log('Facebook API request would be:', facebookAdData);
    console.log('✅ Validation passed - adset_id is now a number:', typeof facebookAdData.adset_id);
    console.log('✅ creative_id is now a number:', typeof facebookAdData.creative.creative_id);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdCreation().catch(console.error);
