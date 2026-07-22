export interface Item {
  id: number;

  name: string;

  brandId: number;
  brand: string;

  kind: string;
  size: string;
  color: string;

  category: string;

  quantity: number;

  costPrice: number;

  expiryDate: string | null;

  isActive: boolean;
}