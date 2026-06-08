export type CartProduct = {
  id: string;
  quantity: number;
  items: Product;
};

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
};

