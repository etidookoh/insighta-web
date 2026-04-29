# Insighta Web Portal

A Next.js web interface for the Insighta Labs+ platform.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login page (GitHub OAuth) |
| `/dashboard` | Metrics overview |
| `/profiles` | Profile list with filters and pagination |
| `/profiles/:id` | Profile detail view |
| `/search` | Natural language search |
| `/account` | User account info and logout |

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Auth Flow

1. User clicks "Continue with GitHub" on login page
2. Browser redirects to `NEXT_PUBLIC_API_URL/auth/github`
3. GitHub OAuth flow completes
4. Backend redirects to `/auth/callback?access_token=...&refresh_token=...`
5. Callback page stores tokens in cookies and redirects to `/dashboard`

## Token Storage

Tokens are stored in browser cookies:
- `access_token` — used as Bearer token on all API requests
- `refresh_token` — used to refresh the access token when expired

Cookies are set with `SameSite=Lax` and short `max-age` values matching token expiry.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Axios