#!/bin/bash

# Elements Festival Planner - Vercel Deployment Script

echo "🎵 Elements Festival Planner - Vercel Deployment"
echo "================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if all files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is clean"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Starting deployment..."

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Visit your deployed URL"
echo "2. Test all features (comments, schedule, etc.)"
echo "3. Share the URL with your team"
echo ""
echo "If you need to make changes:"
echo "1. Make your changes locally"
echo "2. git add . && git commit -m 'Update' && git push"
echo "3. Vercel will automatically redeploy" 