import { createClient } from "@supabase/supabase-js";

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

  // Sharing: og_image when set, else primary / first image from media
  let imageUrl = "https://placehold.co/1200x630?text=Product";
  let ogImageWidth: number | undefined = 1200;
  let ogImageHeight: number | undefined = 630;

  if (hasOgImage) {
    imageUrl = ogFromRow.trim();
    ogImageWidth = undefined;
    ogImageHeight = undefined;
  } else if (data.media && Array.isArray(data.media)) {
    const primaryImage = data.media.find(
      (item: any) => item.type === "image" && item.isPrimary === true
    );
    if (primaryImage?.url) {
      imageUrl = primaryImage.url;
      ogImageWidth = undefined;
      ogImageHeight = undefined;
    } else {
      const firstImage = data.media.find(
        (item: any) => item.type === "image" && item.url
      );
      if (firstImage?.url) {
        imageUrl = firstImage.url;
        ogImageWidth = undefined;
        ogImageHeight = undefined;
      }
    }
  }

  // Apply Cloudinary optimization if needed
  try {
    if (imageUrl.includes("res.cloudinary.com")) {
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        imageUrl = `${parts[0]}/upload/w_1200,h_630,c_fill,ar_1.91,q_auto,f_auto/${parts[1]}`;
        ogImageWidth = 1200;
        ogImageHeight = 630;
      }
    }
  } catch (error) {
    console.error("Error processing image URL:", error);
  }

  // Return data with image_url for backward compatibility
  const productData = {
    ...data,
    image_url: imageUrl,
    ...(ogImageWidth != null && ogImageHeight != null
      ? { og_image_width: ogImageWidth, og_image_height: ogImageHeight }
      : {}),
  };

  console.log("Fetched product:", productData);

  return productData;
}
