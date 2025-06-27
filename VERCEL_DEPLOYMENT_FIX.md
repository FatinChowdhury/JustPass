# 🚀 Vercel Deployment Fix Guide

## Issues Fixed

The following common Vercel deployment issues have been addressed:

1. **Incorrect vercel.json configuration** - Fixed routing and build settings
2. **Serverless function structure** - Reorganized API routes for Vercel
3. **Build process optimization** - Streamlined frontend/backend builds
4. **Environment variable configuration** - Clarified required variables

## 📋 Step-by-Step Deployment

### 1. Verify Environment Variables

In your Vercel project dashboard, ensure these environment variables are set:

```
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
CLERK_SECRET_KEY=sk_test_your_actual_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key
NODE_ENV=production
```

**Important**: Make sure all variables are set for **Production**, **Preview**, and **Development** environments.

### 2. Check Supabase Database Setup

Ensure your Supabase database has the correct table structure:

```sql
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    course TEXT NOT NULL,
    eval_name TEXT NOT NULL,
    grade REAL NOT NULL,
    weight REAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_grades_user_id ON grades(user_id);
CREATE INDEX idx_grades_course ON grades(course);
```

### 3. Verify Clerk Configuration

1. In your Clerk dashboard, go to **Domains**
2. Add your Vercel domain (e.g., `your-app.vercel.app`)
3. Make sure the domain is verified and active

### 4. Deploy to Vercel

1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **Trigger a new deployment** in Vercel dashboard or it will auto-deploy

### 5. Test Your Deployment

After deployment, test these endpoints:
- `https://your-app.vercel.app/` - Frontend should load
- `https://your-app.vercel.app/api/health` - Should return JSON health status
- `https://your-app.vercel.app/api/grades` - Should require authentication

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Ensure all imports use relative paths and the correct file extensions

### Issue: "Function timeout" errors
**Solution**: Database connection issues - verify Supabase credentials

### Issue: "CORS errors"
**Solution**: Already handled in the API configuration

### Issue: "Authentication errors"
**Solution**: Verify Clerk domain settings and environment variables

### Issue: "Build fails"
**Solution**: Check that both frontend and backend dependencies are properly installed

## 📊 Vercel Function Logs

To debug issues:
1. Go to your Vercel project dashboard
2. Click on **Functions** tab
3. Click on any function to see logs
4. Look for error messages in the logs

## 🔍 Key Changes Made

1. **vercel.json**: Updated to properly handle React frontend + Express API
2. **api/index.js**: Created proper serverless function entry point
3. **package.json**: Added root-level configuration for better builds
4. **Backend routing**: Fixed API routes to work with Vercel's serverless functions

## 🚨 If Still Having Issues

1. **Check the Vercel build logs** in your deployment dashboard
2. **Verify all environment variables** are exactly as shown above
3. **Test API endpoints** individually using the Vercel function logs
4. **Check Supabase connection** by testing the database directly

The deployment should now work correctly with these fixes! 