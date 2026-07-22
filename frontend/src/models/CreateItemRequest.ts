export interface CreateItemRequest {
  name: string;

  brandId: number;

  kind: string;
  size: string;
  color: string;

  category: string;

  costPrice: number;

  expiryDate: string | null;
}