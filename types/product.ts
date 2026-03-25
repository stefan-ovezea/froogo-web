export interface Product {
  id?: string;
  title: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  unit?: string;
  imageUrl?: string;
}
