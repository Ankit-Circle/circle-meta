export async function fetchProduct(id: string) {
  // Mock data for now
  // Replace this with Supabase call if needed
  const mockProducts: { [key: string]: { id: string; name: string; description: string; image_url: string } } = {
    abc123: {
      id: "abc123",
      name: "Example Product",
      description: "This is an example product.",
      image_url: "https://placehold.co/600x400?text=Product+Preview"
    }
  };

  return mockProducts[id] ?? null;
}
