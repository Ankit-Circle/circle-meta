import { GetServerSideProps } from "next";
import { fetchProduct } from "../../lib/fetchProduct";

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const id = params?.id as string;
  const ua = req.headers["user-agent"] || "";
  const isBot = /bot|facebook|whatsapp|twitter|linkedin|discord|slack/i.test(ua);

  const product = await fetchProduct(id);
  if (!product) return { notFound: true };

  if (!isBot) {
    return {
      redirect: {
        destination: `${process.env.CIRCLE_APP_URL}/product/${product.product_url_key}`,
        permanent: false,
      },
    };
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${product.name}</title>
      <meta property="og:title" content="${product.name}" />
      <meta name="description" property="og:description" content="${product.description}" />
      <meta name="image" property="og:image" content="${product.image_url}" />
      <meta property="og:url" content="${process.env.CIRCLE_APP_URL}/product/${product.product_url_key}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${product.name}" />
      <meta name="twitter:description" content="${product.description}" />
      <meta name="twitter:image" content="${product.image_url}" />
    </head>
    <body>
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
