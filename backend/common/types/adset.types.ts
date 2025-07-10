
// These should match the values in ../constants/optimizationGoals and ../constants/billingEvents
export type OptimizationGoal =
  | 'NONE'
  | 'APP_INSTALLS'
  | 'AD_RECALL_LIFT'
  | 'ENGAGED_USERS'
  | 'EVENT_RESPONSES'
  | 'IMPRESSIONS'
  | 'LEAD_GENERATION'
  | 'QUALITY_LEAD'
  | 'LINK_CLICKS'
  | 'OFFSITE_CONVERSIONS'
  | 'PAGE_LIKES'
  | 'POST_ENGAGEMENT'
  | 'QUALITY_CALL'
  | 'REACH'
  | 'LANDING_PAGE_VIEWS'
  | 'VISIT_INSTAGRAM_PROFILE'
  | 'VALUE'
  | 'THRUPLAY'
  | 'DERIVED_EVENTS';

export type BillingEvent =
  | 'APP_INSTALLS'
  | 'CLICKS'
  | 'IMPRESSIONS'
  | 'LINK_CLICKS'
  | 'NONE'
  | 'OFFER_CLAIMS'
  | 'PAGE_LIKES'
  | 'POST_ENGAGEMENT'
  | 'THRUPLAY'
  | 'PURCHASE'
  | 'LISTING_INTERACTION';

export interface CreateAdSetRequest {
  campaignId: string;
  name: string;
  optimizationGoal: OptimizationGoal;
  billingEvent: BillingEvent;
  bidAmount: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  status?: 'ACTIVE' | 'PAUSED';
  targeting: any;
  promotedObject?: any;
  facebookAdAccountId: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAdSetRequest {
  name?: string;
  optimizationGoal?: OptimizationGoal;
  billingEvent?: BillingEvent;
  bidAmount?: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  status?: 'ACTIVE' | 'PAUSED';
  targeting?: any;
  promotedObject?: any;
  startTime?: string;
  endTime?: string;
}
