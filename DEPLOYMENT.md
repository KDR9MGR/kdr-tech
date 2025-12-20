# Deployment Guide

## Vercel Deployment

This project is configured to deploy on Vercel. Follow these steps to deploy successfully:

### ⚠️ CRITICAL: Required Environment Variables

**The application WILL NOT WORK without these environment variables!**

Before deploying to Vercel, you **must** add the following environment variables:

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables for **all environments** (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL=https://ecdbvjqgqwhttdgfnzzr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**Where to find these values:**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Navigate to **Settings** → **API**
- Copy the **Project URL** → Use this for `NEXT_PUBLIC_SUPABASE_URL`
- Copy the **anon/public** key → Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**After adding variables:**
- Click **Save**
- Go to **Deployments** tab
- Click on the latest deployment → **Redeploy**

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
