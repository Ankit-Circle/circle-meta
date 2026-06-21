import { createClient } from "@supabase/supabase-js";
import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from "./shareCard";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function fetchProduct(urlKey: string) {
  const { data, error } = await supabase
    .from("products_unified") // ⬅️ your table name here
    .select("id, name, description, product_url_key, media, og_image") // ⬅️ adjust columns as needed
    .eq("product_url_key", urlKey)
    .single();

  if (error || !data) {
    console.error("Failed to fetch product:", error);
    return null;
  }

  const ogFromRow = data.og_image;
  const hasOgImage =
    typeof ogFromRow === "string" && ogFromRow.trim().length > 0;

  // Sharing: Bunny share card in og_image (1218×2166), else primary / first media image
  let imageUrl = "https://placehold.co/600x400?text=Product";
  let imageWidth: number | undefined;
  let imageHeight: number | undefined;

  if (hasOgImage) {
    imageUrl = ogFromRow.trim();
    imageWidth = SHARE_CARD_WIDTH;
    imageHeight = SHARE_CARD_HEIGHT;
  } else if (data.media && Array.isArray(data.media)) {
    const primaryImage = data.media.find(
      (item: any) => item.type === "image" && item.isPrimary === true
    );
    if (primaryImage?.url) {
      imageUrl = primaryImage.url;
    } else {
      const firstImage = data.media.find(
        (item: any) => item.type === "image" && item.url
      );
      if (firstImage?.url) {
        imageUrl = firstImage.url;
      }
    }
  }

  // Cloudinary fallback only — Bunny share cards are already sized for OG
  try {
    if (!hasOgImage && imageUrl.includes("res.cloudinary.com")) {
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
    image_width: imageWidth,
    image_height: imageHeight,
  };

  console.log("Fetched product:", productData);

  return productData;
}
