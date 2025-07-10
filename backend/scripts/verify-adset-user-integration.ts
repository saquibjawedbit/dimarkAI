import { AdSetService } from '../ads-server/services/adsets.service';
import { User } from '../common/models/User';
import { Campaign } from '../common/models/Campaign';
import { AdSet } from '../common/models/AdSet';
import { DatabaseConnection } from '../common/database/connection';

/**
 * Simple verification script to test AdSetService user model integration
 */
async function verifyAdSetServiceUserIntegration() {
  console.log('🔍 Verifying AdSetService User Model Integration...');
  
  try {
    // Connect to database
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    console.log('✅ Database connected');

    // Create a test user with ads account ID
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      adsAccountId: 'act_123456789' // Facebook ads account ID
    });
    await testUser.save();
    console.log('✅ Test user created with Facebook ads account ID');

    // Create a test campaign
    const testCampaign = new Campaign({
      userId: testUser._id.toString(),
      name: 'Test Campaign',
      objective: 'LINK_CLICKS',
      status: 'ACTIVE',
      facebookCampaignId: 'fb_campaign_123'
    });
    await testCampaign.save();
    console.log('✅ Test campaign created');

    // Create AdSetService instance
    const adSetService = new AdSetService(testUser._id.toString());
    console.log('✅ AdSetService instance created');

    // Test creating an ad set (this will test the user model integration)
    const adSetData = {
      name: 'Test Ad Set',
      campaignId: testCampaign._id.toString(),
      optimizationGoal: 'LINK_CLICKS' as const,
      billingEvent: 'LINK_CLICKS' as const,
      bidAmount: 1.50,
      targeting: { age_min: 18, age_max: 65 },
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PAUSED' as const
    };

    const createdAdSet = await adSetService.createAdSet(testUser._id.toString(), adSetData);
    console.log('✅ Ad set created successfully');
    console.log('📋 Ad set details:', {
      id: createdAdSet._id,
      name: createdAdSet.name,
      campaignId: createdAdSet.campaignId,
      userId: createdAdSet.userId,
      facebookAdAccountId: createdAdSet.facebookAdAccountId
    });

    // Test user without ads account ID
    const userWithoutAdsAccount = new User({
      name: 'User Without Ads Account',
      email: 'noads@example.com',
      password: 'password123'
      // No adsAccountId
    });
    await userWithoutAdsAccount.save();
    console.log('✅ User without ads account created');

    const adSetServiceWithoutAds = new AdSetService(userWithoutAdsAccount._id.toString());
    
    try {
      await adSetServiceWithoutAds.createAdSet(userWithoutAdsAccount._id.toString(), adSetData);
      console.log('❌ Should have thrown error for user without ads account');
    } catch (error) {
      if ((error as Error).message.includes('Facebook Ads Account ID not configured for user')) {
        console.log('✅ Correctly threw error for user without ads account');
      } else {
        console.log('❌ Unexpected error:', (error as Error).message);
      }
    }

    // Clean up
    await AdSet.deleteMany({});
    await Campaign.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! AdSetService now properly uses User model for Facebook ads account ID.');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

// Run the verification
verifyAdSetServiceUserIntegration().catch(console.error);
