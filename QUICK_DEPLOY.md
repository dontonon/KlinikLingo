# 🚀 Quick Deploy to Vercel

## Option 1: Two Separate Projects (Recommended)

### Step 1: Deploy Frontend

1. **Go to Vercel**: https://vercel.com/new
2. **Import** your GitHub repository
3. **Configure**:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   (You'll update this after deploying backend)

5. **Deploy**

### Step 2: Deploy Backend

1. **Go to Vercel**: https://vercel.com/new
2. **Import** your GitHub repository (again)
3. **Configure**:
   - Root Directory: `backend`
   - Framework: Other

4. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   DB_HOST=<from-neon-or-vercel-postgres>
   DB_PORT=5432
   DB_NAME=<database-name>
   DB_USER=<database-user>
   DB_PASSWORD=<database-password>
   JWT_SECRET=<random-secure-string-min-32-chars>
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=<your-frontend-url>
   ```

5. **Deploy**

### Step 3: Update Frontend Environment

1. Go back to **Frontend project** in Vercel
2. **Settings → Environment Variables**
3. Update `VITE_API_URL` with your actual backend URL
4. **Redeploy**

### Step 4: Set Up Database

**Using Neon (Free):**

1. Go to https://neon.tech
2. Create new project → Copy connection string
3. Install `pg` locally: `npm install -g pg`
4. Run locally with production DB:
   ```bash
   cd backend
   # Update .env with Neon credentials
   npm run init-db
   npm run seed
   ```

**Using Vercel Postgres:**

1. In Vercel Dashboard → Storage → Create Database
2. Select Postgres → Connect to your backend project
3. Copy connection string
4. Run init-db and seed as above

---

## Option 2: Single Monorepo Deploy

### Step 1: Add Root Build Script

Add to root `package.json`:

```json
{
  "scripts": {
    "vercel-build": "cd frontend && npm install && npm run build"
  }
}
```

### Step 2: Deploy

1. **Go to Vercel**: https://vercel.com/new
2. **Import** repository
3. **Root Directory**: Leave as `/` (root)
4. **Framework**: Vite
5. **Build Command**: `npm run vercel-build`
6. **Output Directory**: `frontend/dist`

### Step 3: Deploy Backend Separately

Backend must still be deployed separately as a serverless function API.

---

## 🗄️ Database Setup (Neon - Easiest)

1. **Sign up**: https://neon.tech
2. **Create project**: "kliniklingo"
3. **Copy connection details**:
   - Host: `ep-xxx.us-east-2.aws.neon.tech`
   - Database: `neondb`
   - User: (provided)
   - Password: (provided)

4. **Initialize locally**:
   ```bash
   cd backend

   # Create .env with Neon credentials
   cat > .env << EOF
   DB_HOST=<neon-host>
   DB_PORT=5432
   DB_NAME=neondb
   DB_USER=<neon-user>
   DB_PASSWORD=<neon-password>
   JWT_SECRET=$(openssl rand -base64 32)
   EOF

   # Initialize
   npm run init-db
   npm run seed
   ```

---

## ✅ Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Database created (Neon/Vercel Postgres)
- [ ] Backend env vars configured
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Database initialized (`init-db`)
- [ ] Database seeded with lessons (`seed`)
- [ ] Test: Register → Login → View lessons

---

## 🔗 URLs to Keep Handy

After deployment, save these:
```
Frontend: https://________.vercel.app
Backend:  https://________.vercel.app
Database: postgresql://________
```

---

## 🆘 Common Issues

**"Cannot connect to database"**
- Check database credentials in backend env vars
- Verify database is running (Neon doesn't sleep)
- Check connection string format

**"CORS error"**
- Verify `FRONTEND_URL` in backend env vars
- Make sure it matches your actual frontend URL (no trailing slash)

**"API not found"**
- Check `VITE_API_URL` in frontend env vars
- Verify backend is deployed and healthy
- Test backend: `https://your-backend.vercel.app/api/health`

---

## 🚀 Done!

Your app should now be live! Test by:
1. Opening frontend URL
2. Register account
3. Login
4. Browse A1 lessons
5. Complete exercises

Any questions? Check `DEPLOYMENT.md` for detailed guide.
