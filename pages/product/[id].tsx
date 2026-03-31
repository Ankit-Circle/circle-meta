import { GetServerSideProps } from "next";
import { fetchProduct } from "../../lib/fetchProduct";

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const id = params?.id as string;
  const ua = req.headers["user-agent"] || "";
  const isBot = /bot|facebook|whatsapp|twitter|linkedin|discord|slack/i.test(ua);

  const product = await fetchProduct(id);
  if (!product) {
    res.statusCode = 404;
    res.end("Not Found");
    return { props: {} };
  }

  if (!isBot) {
    res.writeHead(307, {
      Location: `${process.env.CIRCLE_APP_URL}/product/${product.product_url_key}`,
    });
    res.end();
    return { props: {} };
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${product.name}</title>
      <meta property="og:title" content="${product.name}" />
      <meta property="og:description" content="${product.description}" />
      <meta property="og:image" content="${product.image_url}" />
      <meta property="og:url" content="${process.env.CIRCLE_APP_URL}/product/${product.product_url_key}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${product.name}" />
      <meta name="twitter:description" content="${product.description}" />
      <meta name="twitter:image" content="${product.image_url}" />
    </head>
    <body></body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
  return { props: {} }; // Required by Next.js
};

export default function ProductPage() {
  return null; // This component never renders
}
