import { supabase } from "@/superbase-client";

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
    .eq("user_id", userId);

  if (error) {
    console.error("Cart fetch error:", error.message);
    return [];
  }

  return data;
};