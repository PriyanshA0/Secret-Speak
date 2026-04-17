# 🚀 SecretSpeak Quick Start Guide

Get SecretSpeak running locally in **5 minutes**.

---

## Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Free tier](https://www.mongodb.com/cloud/atlas))
- Clerk account ([Free tier](https://clerk.com))
- Git installed

---

## 1️⃣ Clone Repository
```bash
git clone https://github.com/PriyanshA0/Secret-Speak.git
cd secretspeak
```

---

## 2️⃣ Install Dependencies
```bash
npm install
```

---

## 3️⃣ Configure Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Copy **Publishable Key** (`pk_test_...`)
4. Copy **Secret Key** (`sk_test_...`)

---

## 4️⃣ Configure MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Add your IP to Network Access
4. Create database user & copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 5️⃣ Set Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# From Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY

# From MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secretspeak
MONGODB_DB=secretspeak

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6️⃣ Start Development Server
```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## ✨ You're Done!

### First Time Setup
1. Sign up with email/phone/Google
2. Select university on onboarding page
3. Start creating posts!

### Available Pages
- 🏠 Home: `http://localhost:3000`
- 🔥 Trending: `http://localhost:3000/trending`
- ✏️ Create Post: `http://localhost:3000/create`
- 👤 Profile: `http://localhost:3000/profile`
- 📋 Guidelines: `http://localhost:3000/guidelines`

---

## 🛠️ Troubleshooting

### Clerk Error: "Failed to load script"
See [CLERK_SETUP.md](CLERK_SETUP.md) for detailed fix.

**Quick fix:**
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Hard refresh browser: `Ctrl+Shift+Delete`

### MongoDB Connection Failed
1. Check `.env.local` has correct `MONGODB_URI`
2. Add your IP to MongoDB Atlas Network Access
3. Restart dev server

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

---

## 📚 Full Documentation

- **[README.md](README.md)** — Complete project overview
- **[CLERK_SETUP.md](CLERK_SETUP.md)** — Clerk configuration & debugging
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Deploy to Vercel (coming soon)

---

## ✅ What's Working

- ✅ User authentication (Clerk)
- ✅ Campus selection & isolation
- ✅ Post creation (4 types)
- ✅ Reactions & comments
- ✅ Trending topics (live)
- ✅ Dark theme UI
- ✅ Responsive design

---

## 🎯 Next Steps

1. **Customize** universities in [lib/universities.ts](lib/universities.ts)
2. **Deploy** to Vercel (see [README.md](README.md))
3. **Invite friends** and build community
4. **Report bugs** via [GitHub Issues](https://github.com/PriyanshA0/Secret-Speak/issues)

---

## 💬 Need Help?

- 📖 Check [README.md](README.md) troubleshooting section
- 🔧 See [CLERK_SETUP.md](CLERK_SETUP.md) for auth issues
- 🐛 Create [GitHub Issue](https://github.com/PriyanshA0/Secret-Speak/issues)

---

**Happy Building! 🎉**
