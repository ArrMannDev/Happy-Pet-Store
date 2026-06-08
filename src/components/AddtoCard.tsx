import type { CartProduct } from "@/type/cart.type";
import { Card, CardDescription, CardTitle } from "./ui/card";

export default function AddtoCard({
  cartProducts,
}: {
  cartProducts: CartProduct[];
}) {
  return (
    <div className="w-full flex flex-row items-center gap-3">
      <div className="w-[70%] flex flex-col">
        {cartProducts?.map((product) => {
          return (
            <Card className="flex flex-row w-full item-center overflow-hidden" key={product.id}>
              <img src={product?.items?.image_url} alt="Dog Food" className="w-30 h-33 "></img>
              
              <div className="w-full flex flex-col justify-center item-center">
                <CardTitle>{product?.items.name}</CardTitle>
                <CardDescription>{product?.items.price}</CardDescription>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="w-[30%] bg-blue-500">ds</div>
    </div>
  );
}
