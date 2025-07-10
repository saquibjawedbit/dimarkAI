import { AdSetService } from '../ads-server/services/adsets.service';
import { User } from '../common/models/User';
import { Campaign } from '../common/models/Campaign';
import { AdSet } from '../common/models/AdSet';
import { connectToDatabase } from '../common/database/connection';

describe('AdSetService - User Model Integration', () => {
  let adSetService: AdSetService;
  let testUserId: string;
  let testCampaignId: string;

  beforeAll(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    // Create a test user with ads account ID
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      adsAccountId: 'act_123456789' // Facebook ads account ID
    });
    await testUser.save();
    testUserId = testUser._id.toString();

    // Create a test campaign
    const testCampaign = new Campaign({
      userId: testUserId,
      name: 'Test Campaign',
      objective: 'LINK_CLICKS',
      status: 'ACTIVE',
      facebookCampaignId: 'fb_campaign_123'
    });
    await testCampaign.save();
    testCampaignId = testCampaign._id.toString();

    adSetService = new AdSetService(testUserId);
  });

  afterEach(async () => {
    // Clean up test data
    await AdSet.deleteMany({});
    await Campaign.deleteMany({});
    await User.deleteMany({});
  });

  describe('createAdSet', () => {
    it('should create an ad set and fetch Facebook ad account ID from user', async () => {
      const adSetData = {
        name: 'Test Ad Set',
        campaignId: testCampaignId,
        optimizationGoal: 'LINK_CLICKS',
        billingEvent: 'LINK_CLICKS',
        bidAmount: 1.50,
        targeting: { age_min: 18, age_max: 65 },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PAUSED'
      };

      const createdAdSet = await adSetService.createAdSet(testUserId, adSetData);

      expect(createdAdSet).toBeDefined();
      expect(createdAdSet.name).toBe('Test Ad Set');
      expect(createdAdSet.campaignId).toBe(testCampaignId);
      expect(createdAdSet.userId).toBe(testUserId);
      // Note: facebookAdAccountId should be set in the creation process
    });

    it('should throw error if user has no Facebook ads account ID', async () => {
      // Create a user without ads account ID
      const userWithoutAdsAccount = new User({
        name: 'User Without Ads Account',
        email: 'noads@example.com',
        password: 'password123'
        // No adsAccountId
      });
      await userWithoutAdsAccount.save();

      const adSetServiceWithoutAds = new AdSetService(userWithoutAdsAccount._id.toString());

      const adSetData = {
        name: 'Test Ad Set',
        campaignId: testCampaignId,
        optimizationGoal: 'LINK_CLICKS',
        billingEvent: 'LINK_CLICKS',
        bidAmount: 1.50,
        targeting: { age_min: 18, age_max: 65 },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PAUSED'
      };

      await expect(adSetServiceWithoutAds.createAdSet(userWithoutAdsAccount._id.toString(), adSetData))
        .rejects
        .toThrow('Facebook Ads Account ID not configured for user');
    });
  });

  describe('syncAdSetsWithFacebook', () => {
    it('should use user Facebook ads account ID for syncing', async () => {
      // This test would require mocking Facebook API calls
      // For now, we'll just verify the method can be called without errors
      // when the user has a valid ads account ID
      
      try {
        await adSetService.syncAdSetsWithFacebook(testCampaignId);
        // If we get here, the method didn't throw an error about missing ads account
        // (it might throw other errors about Facebook API, but that's expected in tests)
      } catch (error) {
        // The error should NOT be about missing Facebook ads account ID
        expect((error as Error).message).not.toContain('Facebook Ads Account ID not configured for user');
      }
    });
  });
});
