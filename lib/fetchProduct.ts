import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function fetchProduct(urlKey: string) {
  const { data, error } = await supabase
    .from("products_unified") // ⬅️ your table name here
    .select("id, name, description, product_url_key, media") // ⬅️ adjust columns as needed
    .eq("product_url_key", urlKey)
    .single();

  if (error || !data) {
    console.error("Failed to fetch product:", error);
    return null;
  }

  // Find the primary image from media array
  let imageUrl = "https://placehold.co/600x400?text=Product"; // fallback
  if (data.media && Array.isArray(data.media)) {
    const primaryImage = data.media.find(
      (item: any) => item.type === "image" && item.isPrimary === true
    );
    if (primaryImage) {
      imageUrl = primaryImage.url;
    } else {
      // Fallback to first image if no primary found
      const firstImage = data.media.find((item: any) => item.type === "image");
      if (firstImage) {
        imageUrl = firstImage.url;
      }
    }
  }

  // Apply Cloudinary optimization if needed
  try {
    if (imageUrl.includes("res.cloudinary.com")) {
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        imageUrl = `${parts[0]}/upload/w_600,c_fill,q_auto,f_auto/${parts[1]}`;
      }
    }
  } catch (error) {
    console.error("Error processing image URL:", error);
  }

  // Return data with image_url for backward compatibility
  const productData = {
    ...data,
    image_url: imageUrl,
  };

  console.log("Fetched product:", productData);

  return productData;
}
