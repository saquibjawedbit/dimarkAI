export interface CreateAdSetRequest {
  campaignId: string;
  name: string;
  optimizationGoal: string;
  billingEvent: string;
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
