import { useAuth } from "@/Context/AuthContext";
import { getMyCart } from "@/api/cart-api";
import AddtoCard from "@/components/AddtoCard";
import { Button } from "@/components/ui/button";
import type { CartProduct } from "@/type/cart.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddToCartPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!session) return;

    const userId = session.user.id;
    const cartItems = await getMyCart(userId);
    setProducts(cartItems);
  };

  useEffect(() => {
    fetchCart();
  }, [session]);

  return session ? (
    <div className="flex flex-col w-full h-full justify-start items-center p-10">
      <div className="w-full flex flex-row items-center gap-3 mt-3 border-b-2 border-[var(--color-bg)] pb-3">
        <h1 className="text-3xl text-[var(--color-bg)] font-bold my-2">
          Your Cart
        </h1>
      </div>

      <AddtoCard cartProducts={products} refreshCart={fetchCart} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4">
      <h1 className="text-2xl font-bold">Please login to see your cart</h1>

      <Button
        onClick={() => navigate("/login")}
        variant="default"
        size="lg"
        className="px-10 py-5"
      >
        Login
      </Button>
    </div>
  );
}