import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Android Digital Asset Links for App Links verification.
 *
 * Served at `/.well-known/assetlinks.json` via the rewrite in
 * `next.config.js`. Lets Android verify that this domain belongs to the Circle
 * app so shared `https://preview.circlestore.in/product/...` links open the
 * app instead of the browser.
 *
 * Keep the package name and SHA-256 fingerprints in sync with the production
 * `circlestore.in` assetlinks.json (debug + release signing certs).
 */
const ASSET_LINKS = [
  {
    "relation": [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds"
    ],
    target: {
      namespace: "android_app",
      package_name: "com.zercle.circle",
      sha256_cert_fingerprints: [
        "0F:D3:C7:7A:6D:DD:2C:85:C1:5A:08:A3:FF:74:DC:E9:A0:62:B2:C2:23:39:BC:23:94:06:77:EC:95:AD:F0:03",
        "40:A8:8C:54:F2:8F:76:14:F0:A3:25:76:2C:B4:24:E3:16:FB:FB:01:CD:4F:90:1D:93:30:29:A7:D4:E8:17:39",
        "C4:2E:00:41:67:1D:07:0B:5E:C3:02:D3:4B:D2:96:33:E3:6E:B5:C8:D0:3F:9D:C8:5A:70:50:CD:2A:66",
        "C4:2E:00:41:67:1B:07:08:5E:C3:B2:D3:4B:02:96:33:E3:6E:B5:C8:D8:3F:9B:C8:5A:70:50:CD:2A:66:28:05"
      ],
    },
  },
];

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(JSON.stringify(ASSET_LINKS));
}
