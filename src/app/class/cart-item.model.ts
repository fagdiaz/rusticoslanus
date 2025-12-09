import { Product } from 'src/app/services/products.service';

export interface CartItem {
  product: Product;
  quantity: number;
}
