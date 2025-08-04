import { GetServerSideProps } from "next";
import { fetchProduct } from "../../lib/fetchProduct";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const product = await fetchProduct(id);

  if (!product) return { notFound: true };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${product.name}</title>
      <meta property="og:title" content="${product.name}" />
      <meta name="description" property="og:description" content="${product.description}" />
      <meta name="image" property="og:image" content="${product.image_url}" />
      <meta property="og:url" content="${process.env.NEXT_PUBLIC_APP_URL}/product/${product.product_url_key}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${product.name}" />
      <meta name="twitter:description" content="${product.description}" />
      <meta name="twitter:image" content="${product.image_url}" />
    </head>
    <body>
      <script>
        window.location.href = "${process.env.NEXT_PUBLIC_APP_URL}/product/${product.product_url_key}";
      </script>
    </body>
    </html>
  `;


  return {
    props: {
      html,
    },
  };
};

export default function ProductPage({ html }: { html: string }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
