# Vercel Deployment Guide

This guide will help you deploy the FoodFitAI application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A MongoDB Atlas account (free tier available)
- Git installed on your machine
- The project code pushed to a GitHub repository

## Step 1: Prepare Your MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string from the "Connect" button
6. Format it as: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`

## Step 2: Push Code to GitHub

1. Initialize git if not already done:
   ```bash
   git init
   ```

2. Add all files:
   ```bash
   git add .
   ```

3. Commit changes:
   ```bash
   git commit -m "Ready for Vercel deployment"
   ```

4. Create a new repository on GitHub
5. Add remote origin:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

6. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project root:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name: `foodfit-ai` (or your preferred name)
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. Add environment variables:
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB connection string
   # Select all environments (Production, Preview, Development)

   vercel env add JWT_SECRET
   # Paste a secure JWT secret (generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   # Select all environments
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./`
   - **Build Command**: `CI=false npm run build`
   - **Output Directory**: `build`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secure JWT secret
6. Click "Deploy"

## Step 4: Verify Deployment

1. Wait for the deployment to complete
2. Visit the provided URL
3. Test the application:
   - Register a new user
   - Login
   - Access the dashboard
   - Test various features

## Project Structure for Vercel

```
ai-ingredient-replacer-main/
├── api/
│   ├── index.js          # Vercel serverless function (backend)
│   └── package.json      # API dependencies
├── backend/              # Original backend code (referenced by api/)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── src/                  # React frontend
├── public/               # Static assets
├── vercel.json           # Vercel configuration
├── package.json          # Root dependencies
└── .env.example          # Environment variables template
```

## How It Works

- **Frontend**: Deployed as a static React app using Create React App
- **Backend**: Deployed as Vercel serverless functions in the `api/` directory
- **API Routes**: All `/api/*` requests are routed to the serverless function
- **Database**: MongoDB Atlas connection via environment variables

## Environment Variables

Make sure to set these in Vercel:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT authentication

## Troubleshooting

### Build Fails

- Ensure all dependencies are in `package.json`
- Check that `CI=false npm run build` works locally
- Review build logs in Vercel dashboard

### API Errors

- Verify `MONGODB_URI` is set correctly in Vercel environment variables
- Check MongoDB Atlas IP whitelist
- Review serverless function logs in Vercel

### Database Connection Issues

- Ensure MongoDB connection string format is correct
- Check that database user has proper permissions
- Verify cluster is running in MongoDB Atlas

## Local Development

To run locally after deployment setup:

1. Copy `.env.example` to `.env.local`
2. Add your environment variables to `.env.local`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm start
   ```

## Updating the Application

After making changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. Vercel will automatically deploy updates on push to main branch
3. Or manually deploy:
   ```bash
   vercel --prod
   ```

## Support

If you encounter issues:
- Check Vercel deployment logs
- Review MongoDB Atlas logs
- Ensure all environment variables are set
- Verify API routes are working correctly
