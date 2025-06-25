#!/bin/bash

echo "🚀 JustPass Deployment Helper"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Committing changes..."
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy updates"
    fi
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
fi

# Check if remote origin exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔄 Pushing to GitHub..."
    git push origin main
    echo "✅ Pushed to GitHub"
else
    echo "⚠️  No GitHub remote found."
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/justpass.git"
    echo "git push -u origin main"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. 🗄️  Set up Supabase database"
echo "2. 🔐 Get your Clerk credentials"
echo "3. 🚀 Deploy to Vercel"
echo "4. 🌐 Configure your domain"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 