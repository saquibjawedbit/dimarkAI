import { CampaignObjective } from '../types';

export const CAMPAIGN_OBJECTIVES: Array<{ value: CampaignObjective; label: string }> = [
  { value: 'OUTCOME_LEADS', label: 'Lead Generation' },
  { value: 'OUTCOME_SALES', label: 'Sales & Conversions' },
  { value: 'OUTCOME_ENGAGEMENT', label: 'Engagement' },
  { value: 'OUTCOME_AWARENESS', label: 'Brand Awareness' },
  { value: 'OUTCOME_TRAFFIC', label: 'Website Traffic' },
  { value: 'OUTCOME_APP_PROMOTION', label: 'App Promotion' },
];

export const CAMPAIGN_OBJECTIVE_DESCRIPTIONS: Record<CampaignObjective, string> = {
  'OUTCOME_LEADS': 'Generate leads for your business through forms, calls, or messages',
  'OUTCOME_SALES': 'Drive sales and conversions on your website or app',
  'OUTCOME_ENGAGEMENT': 'Increase engagement with your posts and content',
  'OUTCOME_AWARENESS': 'Increase brand awareness and reach new audiences',
  'OUTCOME_TRAFFIC': 'Drive traffic to your website or landing page',
  'OUTCOME_APP_PROMOTION': 'Promote your mobile app and increase installs',
};
