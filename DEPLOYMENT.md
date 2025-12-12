# Deployment Guide

## Vercel Deployment

This project is configured to deploy on Vercel. Follow these steps to deploy successfully:

### Required Environment Variables

Before deploying to Vercel, you **must** add the following environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project:
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Navigate to **Settings** → **API**
- Copy the **Project URL** and **anon/public** key

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the environment variables (see above)
4. Deploy!

### Troubleshooting

#### Build fails with "Supabase client requires URL and API key"

This means you haven't set the environment variables in Vercel. Make sure to:
- Add `NEXT_PUBLIC_SUPABASE_URL`
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redeploy the project

#### Pages fail to prerender

This is expected for admin and auth routes. The project is configured to handle this with:
- `export const dynamic = 'force-dynamic'` in admin and auth layouts
- Direct Supabase queries instead of HTTP fetches during build time

## Local Development

For local development, create a `.env.local` file (already exists) with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

## Production Build

To test a production build locally:

```bash
npm run build
npm start
```
