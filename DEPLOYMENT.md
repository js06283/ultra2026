# Deploying Elements Festival Planner to Vercel

This guide will help you deploy your Elements Festival Planner application to Vercel.

## Prerequisites

1. **GitHub Account**: Make sure your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a static site

3. **Configure Project**:

   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (not needed for static sites)
   - **Output Directory**: Leave empty (not needed for static sites)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a URL like: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Confirm deployment settings
   - Deploy!

## Environment Variables (Optional)

If you're using Firebase, you might want to set environment variables in Vercel:

1. Go to your project dashboard in Vercel
2. Navigate to Settings > Environment Variables
3. Add any Firebase configuration variables if needed

## Custom Domain (Optional)

1. Go to your project dashboard in Vercel
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## File Structure

Your deployment will include these key files:

```
├── index.html              # Main entry point
├── styles.css              # Styles
├── script.js               # Main JavaScript
├── firebase-config.js      # Firebase configuration
├── csv-parser.js           # CSV parsing logic
├── load-schedule.js        # Schedule loading
├── Elements_Festival_Full_Schedule__All_Days_.csv  # Festival data
├── vercel.json             # Vercel configuration
├── package.json            # Project metadata
└── .gitignore              # Git ignore rules
```

## Troubleshooting

### Common Issues

1. **Build Errors**:

   - Check that all files are committed to Git
   - Ensure `index.html` is in the root directory
   - Verify all JavaScript files are properly referenced

2. **404 Errors**:

   - Make sure `vercel.json` is configured correctly
   - Check that all file paths are correct

3. **CORS Issues**:
   - Vercel handles CORS automatically for static sites
   - If you're loading external resources, ensure they allow CORS

### Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

## Post-Deployment

After successful deployment:

1. **Test the Application**:

   - Visit your deployed URL
   - Test all features (comments, schedule, etc.)
   - Check mobile responsiveness

2. **Monitor Performance**:

   - Use Vercel Analytics (if enabled)
   - Check for any console errors

3. **Share Your App**:
   - Share the Vercel URL with your team
   - Consider adding a custom domain for easier access
