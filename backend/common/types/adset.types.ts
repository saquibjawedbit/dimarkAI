import { OPTIMIZATION_GOALS } from '../constants/optimizationGoals';
import { BILLING_EVENTS } from '../constants/billingEvents';

export interface CreateAdSetRequest {
  campaignId: string;
  name: string;
  optimizationGoal: typeof OPTIMIZATION_GOALS[number];
  billingEvent: typeof BILLING_EVENTS[number];
  bidAmount: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  status?: 'ACTIVE' | 'PAUSED';
  targeting: any;
  promotedObject?: any;
  facebookAdAccountId: string;
}

export interface UpdateAdSetRequest {
  name?: string;
  optimizationGoal?: string;
  billingEvent?: string;
  bidAmount?: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  status?: 'ACTIVE' | 'PAUSED';
  targeting?: any;
  promotedObject?: any;
}
