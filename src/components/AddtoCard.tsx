import type { CartProduct } from "@/type/cart.type";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Button } from "@base-ui/react";
import { Minus, Plus } from "lucide-react";
import {
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  removeCart,
} from "@/api/cart-api";

export default function AddtoCard({
  cartProducts,
  refreshCart,
}: {
  cartProducts: CartProduct[];
  refreshCart: () => Promise<void>;
}) {
  return (
    <div className="w-full flex flex-row items-center gap-3 p-2">
      <div className="w-[70%] flex flex-col">
        {cartProducts?.map((product) => {
          return (
            <Card
              className="flex flex-row w-full item-center overflow-hidden"
              key={product.id}
            >
              <img
                src={product?.items?.image_url}
                alt="Dog Food"
                className="w-30 h-33 "
              ></img>

              <div className="w-full flex flex-col justify-center item-center gap-3">
                <CardTitle>{product?.items.name}</CardTitle>
                <CardDescription>{product?.items.price}</CardDescription>
              </div>

              <div className="flex flex-col justify-center items-center gap-3">
                <div className="w-30 flex flex-row justify-center items-center gap-5">
                  <Plus
                    size={15}
                    className="hover:cursor-pointer"
                    onClick={async () => {
                      await increaseCartItemQuantity(product);
                      await refreshCart();
                    }}
                  />
                  <CardDescription>{product?.quantity}</CardDescription>
                  <Minus
                    size={15}
                    className="hover:cursor-pointer"
                    onClick={async () => {
                      await decreaseCartItemQuantity(product);
                      await refreshCart();
                    }}
                  />
                </div>
                
                <CardDescription className="text-xl">{product.items.price*product.quantity} MMK</CardDescription>
                <Button
                  className="text-red-400"
                  onClick={async () => {
                    await removeCart(product.id);
                    await refreshCart();
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="w-[30%] bg-blue-500">ds</div>
    </div>
  );
}
