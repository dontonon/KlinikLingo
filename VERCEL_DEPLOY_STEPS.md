# 🚀 Vercel Deployment - Simple Steps

Follow these steps to deploy KlinikLingo to Vercel:

---

## Prerequisites
- [ ] GitHub repository pushed ✅ (already done!)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Database (we'll set this up)

---

## 🗄️ Step 1: Create Database (5 min)

### Using Neon (Recommended - Free & Easy)

1. Go to **https://neon.tech**
2. Sign up with GitHub
3. Click **"New Project"**
   - Name: `kliniklingo`
   - Region: Choose closest to you
4. Click **"Create Project"**
5. **SAVE THESE** (you'll need them):
   ```
   Host: ep-xxxxx.us-east-2.aws.neon.tech
   Database: neondb
   User: (copy this)
   Password: (copy this)
   Connection String: (copy full string)
   ```

---

## 🔧 Step 2: Deploy Backend (10 min)

1. Go to **https://vercel.com/new**
2. Select your **KlinikLingo** repository
3. **Configure Project**:
   ```
   Project Name: kliniklingo-backend
   Root Directory: backend
   Framework Preset: Other
   Build Command: (leave default)
   Output Directory: (leave default)
   Install Command: npm install
   ```

4. **Add Environment Variables** (click "Add" for each):
   ```
   NODE_ENV = production
   DB_HOST = (paste from Neon)
   DB_PORT = 5432
   DB_NAME = neondb
   DB_USER = (paste from Neon)
   DB_PASSWORD = (paste from Neon)
   JWT_SECRET = (generate random: openssl rand -base64 32)
   JWT_EXPIRES_IN = 7d
   FRONTEND_URL = (leave blank for now)
   ```

5. Click **"Deploy"**
6. Wait for deployment (2-3 min)
7. **COPY YOUR BACKEND URL**:
   ```
   https://kliniklingo-backend.vercel.app
   ```

---

## 🎨 Step 3: Deploy Frontend (5 min)

1. Go to **https://vercel.com/new** (again)
2. Select your **KlinikLingo** repository (again)
3. **Configure Project**:
   ```
   Project Name: kliniklingo-frontend (or kliniklingo)
   Root Directory: frontend
   Framework Preset: Vite
   Build Command: npm run build (auto-detected)
   Output Directory: dist (auto-detected)
   ```

4. **Add Environment Variable**:
   ```
   VITE_API_URL = https://kliniklingo-backend.vercel.app/api
   ```
   (Use your actual backend URL from Step 2)

5. Click **"Deploy"**
6. Wait for deployment (2-3 min)
7. **COPY YOUR FRONTEND URL**:
   ```
   https://kliniklingo.vercel.app
   ```

---

## 🔄 Step 4: Update Backend (2 min)

1. Go back to **Backend project** in Vercel
2. Navigate to **Settings → Environment Variables**
3. Find `FRONTEND_URL` and edit it:
   ```
   FRONTEND_URL = https://kliniklingo.vercel.app
   ```
   (Use your actual frontend URL from Step 3)
4. Go to **Deployments** tab
5. Click **"⋯"** on latest deployment → **"Redeploy"**

---

## 🗃️ Step 5: Initialize Database (5 min)

Now we need to create tables and add lessons:

```bash
# On your computer:
cd KlinikLingo/backend

# Create .env file with Neon credentials
cat > .env << EOF
NODE_ENV=development
DB_HOST=<your-neon-host>
DB_PORT=5432
DB_NAME=neondb
DB_USER=<your-neon-user>
DB_PASSWORD=<your-neon-password>
JWT_SECRET=dev_secret
EOF

# Install dependencies if you haven't
npm install

# Create database tables
npm run init-db

# Add lesson content
npm run seed
```

You should see:
```
✅ Database seeded successfully!
📊 Summary:
  - 2 A1 lessons (complete)
  - 1 A2 lesson (complete)
  - 9 A2 lessons (placeholder)
  - 40 B1-C2 lessons (placeholder)
```

---

## 🎉 Step 6: Test Your App!

1. Open your frontend URL: `https://kliniklingo.vercel.app`
2. Click **"Get Started"**
3. Register a new account
4. Login
5. You should see the dashboard with A1 and A2 levels!
6. Click on **A1** → Try the first lesson
7. Test the exercises (flashcards, quizzes, etc.)

---

## ✅ Deployment Checklist

After completing all steps, verify:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Can register new account
- [ ] Can login
- [ ] Can see dashboard with levels
- [ ] Can open A1 lessons
- [ ] Can view lesson content
- [ ] Exercises work (flashcards, quiz, etc.)
- [ ] Progress saves after completing exercises

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check database credentials in backend env vars
- Make sure you copied host, user, password correctly from Neon
- Verify `init-db` and `seed` ran successfully locally

### "Network Error" or "Failed to fetch"
- Check `VITE_API_URL` in frontend points to correct backend URL
- Verify backend URL ends with `/api` in frontend env var
- Check backend is deployed and running (visit /api/health endpoint)

### "CORS error"
- Make sure `FRONTEND_URL` in backend matches actual frontend URL
- No trailing slash in URLs
- Redeploy backend after updating env vars

### "Lessons not showing"
- Database not seeded - run `npm run seed` locally
- Check backend logs in Vercel dashboard

---

## 📱 Your Live URLs

After deployment, save these:

```
Frontend:  https://__________.vercel.app
Backend:   https://__________.vercel.app
Health:    https://__________backend.vercel.app/api/health
Database:  postgresql://__________

Test User:
Email:     _________
Password:  _________
```

---

## 🎓 What's Next?

- Add more lesson content (A1-03, A1-04, etc.)
- Customize styling and branding
- Add audio pronunciation
- Implement spaced repetition
- Add progress analytics
- Custom domain name

---

## 💡 Pro Tips

1. **Custom Domain**: In Vercel project settings → Domains
2. **Auto Deploy**: Every git push auto-deploys to Vercel
3. **Preview Deploys**: Every PR gets its own preview URL
4. **Environment Variables**: Use different values for production vs preview
5. **Monitoring**: Check Vercel Analytics and Logs for usage stats

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Issues**: Open issue on GitHub repository

---

Congratulations! Your German learning platform is now live! 🎉🇩🇪
