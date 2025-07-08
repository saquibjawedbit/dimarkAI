import { FacebookPage, FacebookAdAccount } from '../types';

export class FacebookService {
  private static instance: FacebookService;
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): FacebookService {
    if (!FacebookService.instance) {
      FacebookService.instance = new FacebookService();
    }
    return FacebookService.instance;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async getPages(): Promise<FacebookPage[]> {
    if (!this.accessToken) throw new Error('No access token');

    try {
      const response = await new Promise((resolve) => {
        window.FB.api('/me/accounts', { access_token: this.accessToken }, (response) => {
          resolve(response);
        });
      });

      return response.data.map((page: any) => ({
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
        category: page.category,
        connected: true
      }));
    } catch (error) {
      console.error('Failed to fetch Facebook pages:', error);
      throw error;
    }
  }

  async getAdAccounts(): Promise<FacebookAdAccount[]> {
    if (!this.accessToken) throw new Error('No access token');

    try {
      const response = await new Promise((resolve) => {
        window.FB.api('/me/adaccounts', { access_token: this.accessToken }, (response) => {
          resolve(response);
        });
      });

      return response.data.map((account: any) => ({
        id: account.id,
        name: account.name,
        accountId: account.account_id,
        currency: account.currency,
        timeZone: account.timezone_name,
        connected: true
      }));
    } catch (error) {
      console.error('Failed to fetch Facebook ad accounts:', error);
      throw error;
    }
  }

  async createAd(params: {
    adAccountId: string;
    pageId: string;
    campaignId: string;
    adSetId: string;
    creative: {
      headline: string;
      description: string;
      imageUrl: string;
      callToAction: string;
    };
  }) {
    if (!this.accessToken) throw new Error('No access token');

    try {
      // Create the ad creative
      const creativeResponse = await new Promise((resolve) => {
        window.FB.api(
          `/${params.adAccountId}/adcreatives`,
          'POST',
          {
            object_story_spec: {
              page_id: params.pageId,
              link_data: {
                message: params.creative.description,
                link: params.creative.imageUrl,
                caption: params.creative.headline,
                call_to_action: {
                  type: params.creative.callToAction
                }
              }
            }
          },
          (response) => {
            resolve(response);
          }
        );
      });

      // Create the ad using the creative
      const adResponse = await new Promise((resolve) => {
        window.FB.api(
          `/${params.adAccountId}/ads`,
          'POST',
          {
            name: params.creative.headline,
            adset_id: params.adSetId,
            creative: { creative_id: creativeResponse.id },
            status: 'ACTIVE'
          },
          (response) => {
            resolve(response);
          }
        );
      });

      return adResponse;
    } catch (error) {
      console.error('Failed to create Facebook ad:', error);
      throw error;
    }
  }

  async getAdPerformance(adId: string): Promise<any> {
    if (!this.accessToken) throw new Error('No access token');

    try {
      const response = await new Promise((resolve) => {
        window.FB.api(
          `/${adId}/insights`,
          'GET',
          {
            fields: [
              'impressions',
              'clicks',
              'ctr',
              'cpc',
              'spend',
              'actions'
            ],
            date_preset: 'last_7d'
          },
          (response) => {
            resolve(response);
          }
        );
      });

      return response.data[0];
    } catch (error) {
      console.error('Failed to fetch ad performance:', error);
      throw error;
    }
  }
}

export const facebookService = FacebookService.getInstance();