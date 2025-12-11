# 🚀 Migrate Your Team Members to Database

## Quick Setup (2 minutes)

### Step 1: Run the Migration SQL

1. Go to your Supabase SQL Editor:
   https://app.supabase.com/project/ecdbvjqgqwhttdgfnzzr/sql/new

2. Open this file: `/migrations/002_seed_team_members.sql`

3. Copy ALL the SQL code

4. Paste it into Supabase SQL Editor

5. Click **"Run"** (bottom right)

6. You should see a table showing 6 team members ✅

---

## What This Migrates

All 6 of your current team members will be added to the database:

1. **Arbaz Kudekar** - Lead Developer (Featured)
2. **Shreya** - Social Media Manager
3. **Abdul Razak** - Manager & Developer (Featured)
4. **Abdul Kadar** - Frontend Developer
5. **Apoorv Pandey** - Backend Developer
6. **Bhakti** - UI/UX Designer

**Data preserved:**
- ✅ Full names
- ✅ Job titles
- ✅ Complete biographies
- ✅ Short bios (auto-generated)
- ✅ Photo URLs (pointing to `/images/profiles/...`)
- ✅ Display order
- ✅ All set to visible/published

---

## Verify It Worked

After running the SQL:

1. Visit: http://localhost:3001/admin/team
2. You should see all 6 team members in the table!
3. Click on any member to edit
4. Toggle visibility, change order, etc.

---

## ⚠️ Important Notes

**Photo URLs:**
- Currently pointing to `/images/profiles/` (static files)
- These will work on your site
- Later, we can upload photos to Supabase Storage if you want

**Next Steps:**
After migration, we'll update the frontend `Team.tsx` component to fetch from the database instead of being hardcoded!

---

## 🎯 Ready?

**Run the SQL now, then tell me when it's done!**

Once complete, your team will be fully manageable through the admin dashboard. 🚀
