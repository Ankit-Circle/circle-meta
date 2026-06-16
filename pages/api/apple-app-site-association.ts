import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Apple App Site Association (AASA) for iOS Universal Links.
 *
 * Served at `/.well-known/apple-app-site-association` via the rewrite in
 * `next.config.js`. Must be returned as `application/json` with no redirect so
 * iOS can verify that this domain belongs to the Circle app and open shared
 * `https://preview.circlestore.in/product/...` links directly in the app.
 *
 * Keep the app ID and path components in sync with the production
 * `circlestore.in` AASA.
 */
const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appIDs: ["K9BQ3PDN2F.com.zercle.circle"],
        components: [
          { "/": "/" },
          { "/": "/category/*" },
          { "/": "/categories" },
          { "/": "/product/*" },
          { "/": "/sell" },
          { "/": "/explore" },
          { "/": "/explore/*" },
          { "/": "/search" },
          { "/": "/search/*" },
          { "/": "/profile" },
          { "/": "/profile/*" },
          { "/": "/order/track/*" },
          { "/": "/order/seller-track/*" },
          { "/": "/checkout/*" },
          { "/": "/my-listing/*/offers" },
          { "/": "/creditinfo" },
          { "/": "/account" },
          { "/": "/auth" },
          { "/": "/home/collection-see-all" },
          { "/": "/payment-success" },
          { "/": "/payment-failed" },
          { "/": "/listing-success" },
          { "/": "/wish" },
          { "/": "/shipping" },
          { "/": "/admin", exclude: true },
          { "/": "/admin/*", exclude: true },
          { "/": "/delivery", exclude: true },
          { "/": "/delivery/*", exclude: true },
        ],
      },
    ],
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(JSON.stringify(AASA));
}
