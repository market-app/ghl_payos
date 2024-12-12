export interface IInfoCustomer {
  name: string;
  phone: string;
  companyEmail: string;
  dayOfBirth: string;
  status: string;
}

export interface IHistoryTierCustomer {
  createdAt: Date;
  createdBy: string;
  tier: {
    name: string;
  };
}
