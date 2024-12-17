export class GetProviderConfigResponseDTO {
  deleted: boolean;
  _id: string;
  locationId: string;
  marketplaceAppId: string;
  name: string;
  description: string;
  imageUrl: string;
  queryUrl: string;
  paymentsUrl: string;
  providerConfig: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  traceId: string;
}
