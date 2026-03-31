import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function pickFallbackImageFromMedia(media: unknown): string | null {
  if (!media || !Array.isArray(media)) return null;
  const primaryImage = media.find(
    (item: { type?: string; url?: string; isPrimary?: boolean }) =>
      item.type === "image" && item.isPrimary === true && item.url
  );
  if (primaryImage?.url) return String(primaryImage.url);
  const firstImage = media.find(
    (item: { type?: string; url?: string }) => item.type === "image" && item.url
  );
  return firstImage?.url ? String(firstImage.url) : null;
}

export async function fetchProduct(urlKey: string) {
  const { data, error } = await supabase
    .from("products_unified")
    .select("id, name, description, product_url_key, media, og_image")
    .eq("product_url_key", urlKey)
    .single();

  if (error || !data) {
    console.error("Failed to fetch product:", error);
    return null;
  }

  const ogTrimmed =
    typeof data.og_image === "string" ? data.og_image.trim() : "";
  const fallback = pickFallbackImageFromMedia(data.media);

  let imageUrl = "https://placehold.co/600x400?text=Product";
  if (ogTrimmed) {
    imageUrl = ogTrimmed;
  } else if (fallback) {
    imageUrl = fallback;
  }

  // OG URLs are already 1200×630 when from og_image; only downscale list-style fallbacks on Cloudinary.
  const shouldOptimizeListSize = !ogTrimmed && Boolean(fallback);
  try {
    if (
      shouldOptimizeListSize &&
      imageUrl.includes("res.cloudinary.com") &&
      imageUrl.includes("/upload/")
    ) {
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        imageUrl = `${parts[0]}/upload/w_600,c_fill,q_auto,f_auto/${parts[1]}`;
      }
    }
  } catch (err) {
    console.error("Error processing image URL:", err);
  }

  const productData = {
    ...data,
    image_url: imageUrl,
  };

  console.log("Fetched product:", productData);

  return productData;
}
