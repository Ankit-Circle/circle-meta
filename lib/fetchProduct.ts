import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function fetchProduct(urlKey: string) {
  const { data, error } = await supabase
    .from("products_unified") // ⬅️ your table name here
    .select("id, name, description, image_url, product_url_key, media") // ⬅️ adjust columns as needed
    .eq("product_url_key", urlKey)
    .single();

  if (error || !data) {
    console.error("Failed to fetch product:", error);
    return null;
  }

  data.image_url = data.media?.[0].url || data.image_url || "https://placehold.co/600x400?text=Product";

  try {
    // if cloudinary, transform to optimize size
    if (data.image_url.includes("res.cloudinary.com")) {
      const parts = data.image_url.split("/upload/");
      if (parts.length === 2) {
        data.image_url = `${parts[0]}/upload/w_600,c_fill,q_auto,f_auto/${parts[1]}`;
      }
    }
  } catch (error) {
    console.error("Error processing image URL:", error);
  }

  console.log("Fetched product:", data);

  return data;
}
