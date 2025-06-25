# 🚀 JustPass Deployment Guide

This guide will help you deploy your JustPass application to your `justpass.study` domain using Vercel and Supabase.

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
4. **Domain** - Your `justpass.study` domain

## 🗄️ Step 1: Set Up Database (Supabase)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Name your project: `justpass`
5. Create a strong database password
6. Choose a region close to your users
7. Click "Create new project"

### 1.2 Create Database Table
1. In your Supabase dashboard, go to "SQL Editor"
2. Run this SQL to create your grades table:

```sql
-- Create grades table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    course TEXT NOT NULL,
    eval_name TEXT NOT NULL,
    grade REAL NOT NULL,
    weight REAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_grades_user_id ON grades(user_id);
CREATE INDEX idx_grades_course ON grades(course);
```

### 1.3 Get Supabase Credentials
1. Go to "Settings" → "API"
2. Copy your:
   - **Project URL** (SUPABASE_URL)
   - **Anon public key** (SUPABASE_ANON_KEY)

## 🔐 Step 2: Set Up Authentication (Clerk)

### 2.1 Get Clerk Credentials
1. Go to your Clerk dashboard
2. Copy your:
   - **Publishable Key** (CLERK_PUBLISHABLE_KEY)
   - **Secret Key** (CLERK_SECRET_KEY)

## 📤 Step 3: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository named `justpass`
   - Don't initialize with README (your project already has files)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/justpass.git
git branch -M main
git push -u origin main
```

## 🚀 Step 4: Deploy to Vercel

### 4.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Choose your `justpass` repository

### 4.2 Configure Build Settings
- **Framework Preset**: Other
- **Root Directory**: Leave empty (.)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install && cd frontend && npm install && cd ../backend && npm install`

### 4.3 Add Environment Variables
In Vercel project settings, add these environment variables:

```
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=production
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at a Vercel URL (e.g., `justpass-abc123.vercel.app`)

## 🌐 Step 5: Connect Custom Domain

### 5.1 Add Domain in Vercel
1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your domain: `justpass.study`
3. Add www subdomain: `www.justpass.study`

### 5.2 Configure DNS
1. Go to your domain provider (where you registered `justpass.study`)
2. Add these DNS records:

**For apex domain (justpass.study):**
- Type: `A`
- Name: `@`
- Value: `76.76.19.61`

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### 5.3 Wait for DNS Propagation
- DNS changes can take up to 48 hours to propagate
- You can check status in Vercel dashboard

## 🔧 Step 6: Update Code for Production

Since we've set up the cloud infrastructure, you need to update your backend to use the cloud database in production:

### 6.1 Update Backend App.js
Replace the import in `backend/App.js`:

```javascript
// Change this line:
import Grade from './models/Grade.js';

// To this:
import Grade from './models/Grade-cloud.js';

// And change this line:
import { createConnection, closeConnection } from './database.js';

// To this:
import { createConnection, closeConnection } from './database-cloud.js';
```

### 6.2 Update API Endpoints for Frontend
In your React components, update API calls to use relative URLs:

```javascript
// Instead of: http://localhost:3001/api/grades
// Use: /api/grades
```

## ✅ Step 7: Test Your Deployment

1. **Visit your domain**: `https://justpass.study`
2. **Test functionality**:
   - Sign up/Login with Clerk
   - Add grades
   - View grades
   - Update grades
   - Delete grades

## 🔍 Troubleshooting

### Common Issues:

1. **500 Error**: Check Vercel function logs for database connection issues
2. **CORS Issues**: Make sure your frontend is making requests to the same domain
3. **Database Connection**: Verify Supabase credentials in Vercel environment variables
4. **Authentication**: Check Clerk keys and domain settings

### Debug Steps:
1. Check Vercel function logs in dashboard
2. Verify environment variables are set correctly
3. Test API endpoints directly: `https://justpass.study/api/health`

## 🎉 You're Live!

Congratulations! Your JustPass application should now be live at `https://justpass.study`

## 📊 Monitoring & Maintenance

- **Vercel Analytics**: Monitor performance and usage
- **Supabase Dashboard**: Monitor database usage and performance  
- **Clerk Dashboard**: Monitor authentication metrics

## 💰 Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 100 serverless function executions
- **Supabase**: Free tier includes 500MB database, 50MB file storage
- **Clerk**: Free tier includes 10,000 monthly active users

Your app should run completely free under normal usage! 