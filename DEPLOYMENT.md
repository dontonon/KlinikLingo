# KlinikLingo Deployment Guide

## 🚀 Deploying to Vercel

This guide will help you deploy both the frontend and backend to Vercel.

### Prerequisites
- GitHub account with this repository
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (we'll use Neon or Vercel Postgres)

---

## Step 1: Set Up Database (Neon - Recommended)

1. Go to https://neon.tech and sign up
2. Create a new project called "kliniklingo"
3. Copy the connection string (looks like: `postgres://user:password@host/database`)
4. Keep this handy for environment variables

**Alternative: Vercel Postgres**
- In Vercel dashboard, go to Storage → Create Database → Postgres
- Follow the prompts and copy the connection string

---

## Step 2: Deploy Backend API

### 2.1 Create Backend Project on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Root Directory**: Set to `backend`
4. **Framework Preset**: Other
5. Click "Deploy"

### 2.2 Add Environment Variables

In the Vercel dashboard for your backend project:

1. Go to **Settings → Environment Variables**
2. Add these variables:

```env
NODE_ENV=production
DB_HOST=<your-neon-host>
DB_PORT=5432
DB_NAME=<your-database-name>
DB_USER=<your-database-user>
DB_PASSWORD=<your-database-password>
JWT_SECRET=<generate-a-random-secure-string>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
```

3. Click "Save"
4. Redeploy the project

### 2.3 Initialize Database

After deployment:

```bash
# Clone your repo locally if you haven't
git clone <your-repo-url>
cd KlinikLingo/backend

# Update .env with your production database credentials
# Then run:
npm run init-db
npm run seed
```

**Note**: Copy your backend URL (e.g., `https://kliniklingo-backend.vercel.app`)

---

## Step 3: Deploy Frontend

### 3.1 Create Frontend Project on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository again
3. **Root Directory**: Set to `frontend`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### 3.2 Add Environment Variables

In the Vercel dashboard for your frontend project:

1. Go to **Settings → Environment Variables**
2. Add:

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

3. Replace `your-backend-url` with your actual backend URL
4. Click "Save"
5. Redeploy

---

## Step 4: Update Backend CORS

Go back to your backend Vercel project:

1. Go to **Settings → Environment Variables**
2. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   FRONTEND_URL=https://your-actual-frontend-url.vercel.app
   ```
3. Redeploy

---

## 🎉 Done!

Your app should now be live at:
- Frontend: `https://your-frontend-url.vercel.app`
- Backend API: `https://your-backend-url.vercel.app/api`

Test by:
1. Opening the frontend URL
2. Registering a new account
3. Exploring the lessons

---

## 📝 Simplified Alternative: Single Deployment

If you prefer, you can deploy everything as one project:

1. Keep backend as API routes in a `/api` folder at root
2. Deploy the entire repo with root directory as "/"
3. Vercel will automatically detect both

This requires restructuring but is simpler for monorepos.

---

## 🔧 Troubleshooting

### Database Connection Issues
- Verify your database credentials
- Check that Neon database is active
- Ensure IP allowlisting is configured (Neon allows all by default)

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your actual frontend URL
- Check that frontend `VITE_API_URL` is correct

### Build Errors
- Clear build cache in Vercel dashboard
- Check logs in deployment details

---

## 🔄 Continuous Deployment

Once set up, any push to your branch will automatically deploy:
- Push to `main` → Production deployment
- Push to other branches → Preview deployments

---

## 📊 Database Management

To add more lessons later:

1. Create JSON files with lesson content
2. Run seed script locally:
   ```bash
   npm run seed
   ```
3. Or connect directly to your Neon database using psql/pgAdmin

---

## 🌟 Production Checklist

- [ ] Database set up and seeded
- [ ] Backend deployed with correct env vars
- [ ] Frontend deployed with correct env vars
- [ ] CORS configured properly
- [ ] Test registration and login
- [ ] Test lesson viewing
- [ ] Test exercises
- [ ] Custom domain configured (optional)

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- GitHub Issues: Open an issue in your repository
