# Clerk Setup & Troubleshooting Guide

## Clerk JS Failed to Load Error

**Error Message:**
```
Clerk: Failed to load Clerk JS, failed to load script: https://faithful-ox-59.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js

(code="failed_to_load_clerk_js")
```

---

## Root Causes & Solutions

### 1. **Invalid or Missing Clerk Publishable Key** ⚠️ (Most Common)

**Symptoms:**
- Clerk script fails to load from domain URL in error message
- `faithful-ox-59.clerk.accounts.dev` doesn't match your Clerk app

**Fix:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your **app** (not the organization)
3. Navigate to **API Keys** → **Reveal**
4. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
   ```
6. **Restart dev server**: `npm run dev` (press `Ctrl+C` first, then run again)
7. **Hard refresh browser**: `Ctrl+Shift+Delete` or `Cmd+Shift+Delete`

**Check Current Key:**
```bash
grep NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY .env.local
```

---

### 2. **Clerk Domain Mismatch**

**Symptoms:**
- Error shows `faithful-ox-59.clerk.accounts.dev` but you're developing on `localhost:3000`

**Fix:**
1. Open Clerk Dashboard → **Settings** → **Domains**
2. Add **Development Domain**:
   ```
   http://localhost:3000
   ```
3. Ensure the domain matches your `NEXT_PUBLIC_APP_URL` in `.env.local`

**Example `.env.local`:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 3. **Stale Browser Cache**

**Fix:**
1. **Full hard refresh**:
   - Windows/Linux: `Ctrl+Shift+Delete` → Clear all data
   - Mac: `Cmd+Shift+Delete` → Clear all data
2. **Or use DevTools**:
   - Open DevTools (`F12`)
   - Right-click refresh button → **Empty cache and hard refresh**
3. **Restart dev server**:
   ```bash
   npm run dev
   ```

---

### 4. **CSP or Network Block** (Rare)

**Symptoms:**
- Browser DevTools → Network tab shows the script request **fails**
- Status: **ERR_CONTENT_DECODING_FAILED** or **403**

**Fix:**

**Option A: Check Browser Extensions**
- Temporarily disable ad blockers, VPNs, and privacy extensions
- Clerk needs to load from CDN: `clerk.accounts.dev`

**Option B: Check Firewall/Proxy**
- If behind corporate network, whitelist `*.clerk.accounts.dev`
- Ask network admin to allow outbound HTTPS to Clerk domains

**Option C: Check Next.js Config**
- Verify no CSP headers blocking Clerk:
   ```typescript
   // next.config.ts - add if needed:
   const nextConfig = {
     headers: async () => [
       {
         source: '/:path*',
         headers: [
           {
             key: 'Content-Security-Policy',
             value: "script-src 'self' https://*.clerk.accounts.dev; frame-src 'self' https://*.clerk.accounts.dev"
           }
         ]
       }
     ]
   };
   ```

---

### 5. **Clerk App Not Active** (Rare)

**Fix:**
1. Open [Clerk Dashboard](https://dashboard.clerk.com)
2. Verify your **app status** shows **Active**
3. Check you're not on a **Free tier that's been suspended**
4. If suspended, upgrade or create new app

---

## Verification Checklist

Run through this checklist in order:

```bash
# 1. Verify env file exists
test -f .env.local && echo "✓ .env.local exists" || echo "✗ .env.local missing"

# 2. Check publishable key format
grep "pk_test_\|pk_live_" .env.local && echo "✓ Valid key format" || echo "✗ Invalid key"

# 3. Restart dev server (stop and start fresh)
npm run dev

# 4. Check browser console for full error
# F12 → Console tab → Look for full error message

# 5. Visit http://localhost:3000/sign-in
# If it loads (even if redirects), Clerk is working
```

---

## Debug Mode: Enable Verbose Logging

Add to [app/layout.tsx](app/layout.tsx) for detailed Clerk logs:

```typescript
// At the top of ClerkProvider setup:
if (typeof window !== 'undefined') {
  console.log('Clerk Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...');
}
```

---

## Step-by-Step Recovery Process

If still stuck, follow this **recovery sequence**:

### Step 1: Remove & Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm install @clerk/nextjs@latest
```

### Step 2: Update Environment
```bash
# Backup old env
cp .env.local .env.local.backup

# Get fresh keys from Clerk Dashboard
# Edit .env.local with NEW keys
nano .env.local
```

### Step 3: Clear Everything
```bash
# Kill dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

### Step 4: Test Clerk Routes
```bash
# Visit these URLs in order:
# 1. http://localhost:3000 → Should work (redirects to /sign-in if no session)
# 2. http://localhost:3000/sign-in → Should show Clerk form
# 3. http://localhost:3000/sign-up → Should show Clerk form
# 4. Open DevTools Console → Should be clean (no Clerk errors)
```

---

## Network Tab Debugging

1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Refresh page (`Ctrl+R`)
4. **Filter by**: `clerk`
5. Look for requests to:
   - `https://faithful-ox-59.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js`
   - Status should be **200**, not **403** or **404**

**If fails:**
- Check domain in error message
- Verify it matches your Clerk app instance
- Restart dev server

---

## Production Deployment (Vercel)

### Before Deploy:
1. Create **Production Clerk App** (separate from Development)
2. Get **Live Keys** (`pk_live_...`, `sk_live_...`)
3. Add to Vercel Environment Variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   CLERK_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   ```

### After Deploy:
1. Add **Production Domain** in Clerk Dashboard:
   ```
   https://yourdomain.vercel.app
   ```
2. Test: Visit `https://yourdomain.vercel.app/sign-in`

---

## Common Clerk Settings

### Redirect URLs (in Clerk Dashboard → Settings)

**Development:**
```
http://localhost:3000/sign-in
http://localhost:3000/sign-up
```

**Production (Vercel):**
```
https://yourdomain.vercel.app/sign-in
https://yourdomain.vercel.app/sign-up
```

### Authentication Methods to Enable

Go to **User & Authentication** → **Email, Phone, Username**:
- ✅ Email
- ✅ Phone
- ✅ Google (recommended)
- ✅ GitHub (optional)

---

## Still Stuck?

### Get More Info:
1. **Clerk Status Page**: https://status.clerk.com
2. **Full Error in DevTools**: Open Console tab, screenshot full error
3. **Check .env.local keys** (don't share publicly!)
4. **Verify domain** in error matches your Clerk account

### Contact Support:
- **Clerk Docs**: https://clerk.com/docs
- **GitHub Issues**: https://github.com/PriyanshA0/Secret-Speak/issues
- **Clerk Support**: https://clerk.com/support

---

## Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `failed to load script: ...clerk.accounts.dev` | Bad/missing key | Update `.env.local` with correct key |
| `script loading timeout` | Network block | Check firewall, disable VPN/proxy |
| `Clerk object undefined` | Not loaded | Hard refresh + restart server |
| `Domain not authorized` | Domain mismatch | Add to Clerk Settings → Domains |
| `401 Unauthorized on /api/...` | Invalid secret key | Update `CLERK_SECRET_KEY` |

---

**Version Info:**
- Clerk: 7.0.11
- Next.js: 16.2.2
- Node: 18+

**Last Updated:** April 2026
