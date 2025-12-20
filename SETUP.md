# KDR Tech Portfolio - Setup Guide

Welcome to your KDR Tech portfolio transformation! This guide will walk you through setting up your new CMS-powered website.

## 🎯 What We've Built

Your codebase now includes:
- ✅ Admin dashboard with authentication
- ✅ Modern Shadcn/UI components
- ✅ Supabase client setup (browser, server, middleware)
- ✅ Admin login page
- ✅ Dashboard layout with sidebar navigation
- ✅ Database migration SQL ready to run
- ✅ All dependencies installed

## 📋 Setup Checklist (30 minutes total)

### Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `kdr-tech-portfolio`
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait ~2 minutes for provisioning

### Step 2: Get API Credentials (2 minutes)

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon/public key** (the `anon` `public` key)

### Step 3: Configure Environment Variables (2 minutes)

1. In your project root, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Step 4: Run Database Migrations (5 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `/migrations/001_initial_schema.sql` in your code editor
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click "Run" button (bottom right)
7. You should see "Success. No rows returned" ✅

**What this creates:**
- `team_members` table
- `blog_posts` table
- `testimonials_video` table
- `testimonials_text` table
- `team_tags` table
- Row Level Security policies
- Performance indexes

### Step 5: Create Storage Buckets (5 minutes)

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Create these buc3 buckets (one at a time):

   **Bucket 1:**
   - Name: `team-photos`
   - Public bucket: ✅ (check this box)
   - Click "Create bucket"

   **Bucket 2:**
   - Name: `blog-images`
   - Public bucket: ✅ (check this box)
   - Click "Create bucket"

   **Bucket 3:**
   - Name: `testimonials`
   - Public bucket: ✅ (check this box)
   - Click "Create bucket"

### Step 6: Create Your Admin User (5 minutes)

Option A: **Via Supabase Dashboard (Recommended)**
1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: your@email.com
   - Password: (create a secure password)
   - Auto Confirm User: ✅ (check this)
4. Click "Create user"

Option B: **Via SQL**
1. Go to **SQL Editor**
2. Run this query (replace with your email/password):
   ```sql
   -- This will create your admin account
   -- No need to run if you used Option A above
   ```

### Step 7: Start Development Server (2 minutes)

```bash
npm run dev
```

Visit: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Login with the credentials you created in Step 6.

You should see the admin dashboard! 🎉

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Can access `/admin/login`
- [ ] Can log in with your admin credentials
- [ ] Dashboard shows at `/admin`
- [ ] Sidebar navigation works
- [ ] All 4 stat cards show "0" (no data yet)
- [ ] No console errors

---

## 🚀 Next Steps

Now that your foundation is set up, you're ready for **Week 2: Team Management**

**Immediate next tasks:**
1. Create team members list page (`/admin/team`)
2. Create team member form (add/edit)
3. Migrate your existing 6 team members to database
4. Build public team pages

See the implementation plan at `~/.claude/plans/delegated-strolling-hoare.md` for full Phase 2 details.

---

## 🐛 Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` has correct values
- Make sure you copied the **anon/public** key, not the service role key
- Restart dev server: `npm run dev`

### Can't log in
- Verify user was created in Supabase Authentication > Users
- Check "Auto Confirm User" was checked
- Try password reset if needed

### Blank dashboard / data not loading
- Confirm SQL migration ran successfully
- Check browser console for errors
- Verify RLS policies were created (they're in the migration SQL)

### Images won't upload later
- Confirm storage buckets are set to "Public"
- Check bucket names match exactly: `team-photos`, `blog-images`, `testimonials`

---

## 📚 Helpful Resources

- **Supabase Docs**: https://supabase.com/docs
- **Shadcn/UI Docs**: https://ui.shadcn.com
- **Next.js App Router**: https://nextjs.org/docs/app
- **Your Implementation Plan**: `~/.claude/plans/delegated-strolling-hoare.md`

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the implementation plan for context
3. Check Supabase logs: Dashboard > Logs
4. Verify environment variables are loaded: add `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` temporarily

---

**Great job! Your foundation is ready. Time to build the Team Management system! 🚀**
