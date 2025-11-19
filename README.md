# Mesh2Motion Funding Page
Single app page that has Stripe integration for giving tips. Uses the "hono" framework which works well with Cloudflare. This makes it easier to use javscript to do both a server-side and client-side logic that is needed for a payment system.

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

