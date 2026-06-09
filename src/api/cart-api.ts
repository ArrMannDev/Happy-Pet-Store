import { supabase } from "@/superbase-client";
import type { CartProduct } from "@/type/cart.type";

export const addToCart = async (itemId: number) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: "Please login first",
    };
  }

  const userId = userData.user.id;

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  }

  const { error } = await supabase.from("cart_items").insert({
    user_id: userId,
    item_id: itemId,
    quantity: 1,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const getMyCart = async (userId: string) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      items (
        id,
        name,
        price,
        image_url,
        stock
      )
    `)
    .eq("user_id", userId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Cart fetch error:", error.message);
    return [];
  }

  return data;
};


export const increaseCartItemQuantity = async (cartItem: CartProduct) => {
  if (cartItem.quantity >= cartItem.items.stock) {
    return { success: false, message: "Cannot exceed available stock" };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity: cartItem.quantity + 1 })
    .eq("id", cartItem.id);
    

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const decreaseCartItemQuantity = async (cartItem: CartProduct) => {
  if (cartItem.quantity == 1) {
    return { success: false, message: "Cannot decrease the quantity" };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity: cartItem.quantity - 1 })
    .eq("id", cartItem.id);
    

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const removeCart = async (cartId:string)=>{
  const {error} = await supabase
  .from("cart_items")
  .delete()
  .eq("id",cartId)

  if(error){
    return {success:false,message:error.message}
  }

  return {success:true}
}