import { AdSet, IAdSet } from '../../common/models/AdSet';
import { CreateAdSetRequest, UpdateAdSetRequest } from '../../common/types';
import { FacebookMarketingAPI } from '../utils/facebook-api.util';
import { FacebookTokenCache } from '../../common/services/cache.service';

export class AdSetService {
  private facebookAPI: FacebookMarketingAPI | null = null;
  private facebookTokenCache: FacebookTokenCache;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.facebookTokenCache = new FacebookTokenCache();
  }

  private async initializeFacebookAPI(): Promise<void> {
    if (this.facebookAPI) return;
    const accessToken = await this.facebookTokenCache.getUserToken(this.userId);
    if (!accessToken) throw new Error('Facebook access token not found for user.');
    this.facebookAPI = new FacebookMarketingAPI(accessToken);
  }

  private async ensureFacebookAPI(): Promise<FacebookMarketingAPI> {
    await this.initializeFacebookAPI();
    if (!this.facebookAPI) throw new Error('Failed to initialize Facebook API');
    return this.facebookAPI;
  }

  async createAdSet(userId: string, adSetData: CreateAdSetRequest): Promise<IAdSet> {
    const adSet = new AdSet({ ...adSetData, userId });
    await adSet.save();
    // Optionally, create on Facebook here
    return adSet;
  }

  async getAdSetsByCampaign(campaignId: string): Promise<IAdSet[]> {
    return AdSet.find({ campaignId });
  }

  async getAdSetById(adSetId: string): Promise<IAdSet | null> {
    return AdSet.findById(adSetId);
  }

  async updateAdSet(adSetId: string, update: UpdateAdSetRequest): Promise<IAdSet | null> {
    return AdSet.findByIdAndUpdate(adSetId, update, { new: true });
  }

  async deleteAdSet(adSetId: string): Promise<void> {
    await AdSet.findByIdAndDelete(adSetId);
  }
}
