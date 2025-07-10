export const BID_STRATEGIES = [
  { value: 'LOWEST_COST_WITHOUT_CAP', label: 'Lowest Cost (No Bid Cap)' },
  { value: 'LOWEST_COST_WITH_BID_CAP', label: 'Lowest Cost (With Bid Cap)' },
  { value: 'COST_CAP', label: 'Cost Cap' },
  { value: 'LOWEST_COST_WITH_MIN_ROAS', label: 'Lowest Cost (Min ROAS)' },
] as const;

export type BidStrategy = typeof BID_STRATEGIES[number]['value'];
