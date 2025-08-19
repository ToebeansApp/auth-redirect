# Firebase Auth Redirect Worker

A Cloudflare Worker that redirects Firebase Authentication requests from custom domains to Firebase's auth domain. This enables Sign in with Redirect flow for Firebase Authentication when using custom domains.

## Why This Exists

Firebase Authentication's Sign in with Redirect flow requires requests to be handled on Firebase's domain. When using a custom domain like `my.toebeans.life`, auth redirects fail unless properly proxied to Firebase's auth handler. This worker solves that problem by forwarding `/__/auth/*` requests to the Firebase project.

See: https://firebase.google.com/docs/auth/web/redirect-best-practices

## How It Works

The worker intercepts requests to `my.toebeans.life/__/auth/*` and proxies them to `toebeans-421217.firebaseapp.com/__/auth/*`, preserving all request parameters, headers, and body content. This allows Firebase Authentication to work seamlessly with custom domains.

## Prerequisites

- Node.js >= 22
- pnpm package manager
- Cloudflare account with Workers enabled
- Custom domain configured in Cloudflare

## Deploying

Install dependencies:

```bash
pnpm install
pnpm build
pnpm deploy
```

This deploys the worker and configures it to handle requests matching the route pattern `my.toebeans.life/__/auth/*`.

## Configuration

The worker configuration is defined in `wrangler.jsonc`:

- **name**: The worker name in Cloudflare
- **main**: Entry point for the compiled worker code
- **routes**: URL pattern that triggers this worker
- **zone_name**: The Cloudflare zone where the worker is deployed

## How It's Used

When a user signs in with a redirect-based authentication provider (Google, Apple, etc.), the flow works as follows:

1. User initiates sign-in on `my.toebeans.life`
2. Firebase redirects to the auth provider
3. Auth provider redirects back to `my.toebeans.life/__/auth/handler`
4. This worker intercepts and forwards the request to Firebase's domain
5. Firebase processes the authentication and redirects back to the app
