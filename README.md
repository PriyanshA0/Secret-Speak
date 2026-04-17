# SecretSpeak 🗣️

A **privacy-first, campus-isolated anonymous social platform** built with modern web technologies. SecretSpeak lets college students share confessions, questions, hot takes, and polls without revealing their identity — while maintaining a safe, moderated community.

**Demo**: [https://secretspeak.vercel.app](https://secretspeak.vercel.app) (Coming Soon)

---

## 🌟 Features

### Core Functionality
- **Anonymous Posting**: Share thoughts without revealing your identity (`@anon_XXXXX`)
- **Campus Isolation**: Feed filtered by selected university — only see posts from your campus
- **Multiple Post Types**: 
  - 💬 Confessions (share secrets)
  - ❓ Questions (ask your peers)
  - 🔥 Hot Takes (bold opinions)
  - 📊 Polls (gather opinions)
- **Reactions**: 🔥 Fire, 😂 Laugh, 💀 Skull, ❤️ Heart — react to posts anonymously
- **Comments & Threading**: Reply to posts and build conversations
- **Content Moderation**: Automated profanity filtering + community reporting system

### Dashboard & Discovery
- **Live Trending Topics**: AI-extracted keywords from post content, weighted by engagement
- **Community Insights**: Real-time stats (active users, posts today, total reactions)
- **Trending Feed**: Sort posts by engagement and recency
- **University Selector**: Quick-switch between 12+ Indian colleges

### User Experience
- **Dark Theme Dashboard**: Modern, distraction-free interface
- **Responsive Design**: Seamless experience on mobile and desktop
- **Onboarding Flow**: University selection with live preview of anonymous identity
- **Profile Management**: Customize visibility, change campus, manage preferences
- **Community Guidelines**: Clear standards to maintain safe space

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 16.2.2 (App Router, Turbopack)
- **UI Library**: [React](https://react.dev/) 19.2.4 with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 (dark theme)
- **Icons**: [Lucide React](https://lucide.dev/) 1.7.0

### Backend & Database
- **Runtime**: Node.js with Next.js API Routes
- **Database**: [MongoDB](https://www.mongodb.com/) 5.x (Atlas Cloud)
- **ORM**: [Mongoose](https://mongoosejs.com/) 9.4.1
- **Validation**: [Zod](https://zod.dev/) 4.3.6 (runtime type checking)

### Authentication & Security
- **Auth Provider**: [Clerk](https://clerk.com/) 7.0.11 (passwordless, social login)
- **Content Safety**: 
  - [bad-words](https://www.npmjs.com/package/bad-words) 4.0.0 (profanity filter)
  - [sanitize-html](https://www.npmjs.com/package/sanitize-html) 2.17.2 (XSS prevention)
- **Middleware**: Custom Clerk middleware for protected routes

### Development Tools
- **Language**: TypeScript 5
- **Linting**: ESLint 9
- **Build**: Turbopack (Next.js native bundler)

---

## 📋 Project Structure

```
secretspeak/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth pages (sign-in, sign-up)
│   ├── page.tsx                  # Home/Latest feed
│   ├── trending/page.tsx         # Trending posts feed
│   ├── create/page.tsx           # New post creation
│   ├── profile/page.tsx          # User profile & settings
│   ├── onboarding/page.tsx       # University selection
│   ├── post/[id]/page.tsx        # Post detail & thread
│   ├── guidelines/page.tsx       # Community rules
│   ├── notifications/page.tsx    # User notifications
│   ├── api/                      # REST API routes
│   │   ├── posts/route.ts        # GET/POST posts
│   │   ├── comments/route.ts     # Comment operations
│   │   ├── reactions/route.ts    # Reaction operations
│   │   ├── reports/route.ts      # Report violations
│   │   └── users/onboard/route.ts # Onboarding endpoint
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles & theme
│
├── components/                   # React components
│   ├── PageShell.tsx             # Main layout wrapper (sidebar + main content)
│   ├── Navbar.tsx                # Navigation (desktop rail + mobile header)
│   ├── FeedClient.tsx            # Feed with filters & sorting
│   ├── PostCard.tsx              # Individual post display
│   ├── CreatePostModal.tsx       # Post creation UI
│   ├── ReactionBar.tsx           # Emoji reactions
│   ├── UniversitySelector.tsx    # Campus switcher
│   ├── CommentSection.tsx        # Comment thread display
│   └── ...                       # Other UI components
│
├── lib/                          # Utilities & helpers
│   ├── db.ts                     # MongoDB connection
│   ├── env.ts                    # Environment validation
│   ├── universities.ts           # University list (12 campuses)
│   ├── constants.ts              # App constants (post types, reactions, etc.)
│   ├── community-insights.ts     # Live trending & stats engine
│   └── validators.ts             # Zod validation schemas
│
├── models/                       # MongoDB Mongoose schemas
│   ├── User.ts                   # User (Clerk linked)
│   ├── Post.ts                   # Post with reactions/comments
│   ├── Comment.ts                # Comments on posts
│   ├── Reaction.ts               # Emoji reactions
│   ├── Report.ts                 # Violation reports
│   └── PollVote.ts               # Poll votes
│
├── actions/                      # Server Actions (Next.js)
│   ├── getPosts.ts               # Fetch posts with filters
│   ├── createPost.ts             # Create new post
│   ├── addComment.ts             # Add comment to post
│   ├── addReaction.ts            # Add reaction to post
│   └── getCurrentUser.ts         # Get authenticated user
│
├── .env.local                    # Environment variables (git-ignored)
├── .env.example                  # Environment template
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint rules
├── proxy.ts                      # Clerk middleware
└── package.json                  # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available)
- **Clerk** account (free tier available)

### Installation

#### 1. Clone the Repository
```bash
git clone git@github.com:PriyanshA0/Secret-Speak.git
cd secretspeak
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Environment Variables

Copy the example file and fill in your credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local` with:

**Clerk Configuration** (from [Clerk Dashboard](https://dashboard.clerk.com)):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/
CLERK_AFTER_SIGN_UP_URL=/onboarding
```

**MongoDB Configuration** (from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secretspeak?retryWrites=true&w=majority
MONGODB_DB=secretspeak
```

**App URLs**:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Dev
# NEXT_PUBLIC_APP_URL=https://your-domain.com  # Production
```

#### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Supported Universities

SecretSpeak currently supports 12 Indian campuses:

1. IIT Delhi
2. IIT Bombay
3. IIT Kanpur
4. IIT Kharagpur
5. BITS Pilani
6. NIT Trichy
7. Delhi University
8. Mumbai University
9. Bangalore University
10. Pune University
11. Hyderabad University
12. Chennai University

*More universities can be added by updating [lib/universities.ts](lib/universities.ts)*

---

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Run Linter
```bash
npm run lint
```

### Development Features
- **Turbopack**: Fast compilation during development
- **Hot Reload**: Changes reflect instantly without page refresh
- **Type Safety**: Full TypeScript support with strict mode
- **Dark Theme**: Pre-configured Tailwind CSS dark mode

---

## 🛡️ Security & Privacy

### Data Protection
- **No Data Selling**: User data is never sold or shared with third parties
- **HTTPS Only**: All data transmitted encrypted
- **Anonymous by Default**: Posts linked to `@anon_XXXXX` handles, not real names
- **Campus Isolation**: See only posts from your selected university

### Content Moderation
- **Automated Filtering**: 
  - Profanity detection (400+ slurs)
  - HTML/script injection prevention
- **Community Reporting**: Users can flag inappropriate posts
- **Manual Review**: Admin dashboard for serious violations (planned)

### User Privacy
- **No Phone/Email Exposure**: Profiles show only anonymous handle + campus
- **Opt-in Visibility**: Users choose if others see their profile
- **No Location Tracking**: Campus selection is voluntary

---

## 🎯 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Home (Latest) | `/` | Newest posts from your campus |
| Trending | `/trending` | Hottest posts by engagement |
| Create Post | `/create` | Compose new confession/question/poll/hot take |
| Post Detail | `/post/[id]` | Full thread with comments |
| Profile | `/profile` | Your settings & visibility |
| Onboarding | `/onboarding` | Select university on first login |
| Guidelines | `/guidelines` | Community rules & expectations |
| Notifications | `/notifications` | Alerts on replies/reactions (placeholder) |
| Sign In | `/sign-in` | Clerk authentication |

---

## 📊 Data Models

### User
```typescript
{
  clerkId: string (unique)
  anonymousHandle: string (@anon_XXXXX)
  university: string (selected campus)
  phone?: string
  profileVisible: boolean
  onboardingComplete: boolean
  createdAt: Date
}
```

### Post
```typescript
{
  author: User (ref)
  type: "confession" | "question" | "poll" | "hot_take"
  title: string
  content: string
  college: string (scoped to campus)
  commentCount: number
  reactions: { fire, laugh, skull, heart }
  pollOptions?: { text, votes }[]
  reportsCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Comment
```typescript
{
  post: Post (ref)
  author: User (ref)
  text: string
  reactions: { fire, laugh, skull, heart }
  replyTo?: Comment (ref)
  createdAt: Date
}
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect on [Vercel Dashboard](https://vercel.com):
   - Import project from GitHub
   - Add environment variables from `.env.local`
   - Click Deploy

3. Update Clerk redirect URLs to your Vercel domain

### Environment Variables for Production
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
CLERK_SECRET_KEY=sk_live_YOUR_LIVE_KEY
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
MONGODB_URI=mongodb+srv://... (production Atlas cluster)
```

---

## 🐛 Troubleshooting

### Clerk JS Failed to Load
**Error**: `Failed to load Clerk JS, failed to load script: https://...clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js`

**Solution**:
1. Restart dev server: `npm run dev` (stops and starts fresh)
2. Clear browser cache: `Ctrl+Shift+Delete` or `Cmd+Shift+Delete`
3. Verify `.env.local` has valid `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. Check Clerk domain in key matches error message
5. Verify Clerk app is active in [Clerk Dashboard](https://dashboard.clerk.com)
6. Hard refresh browser: `Ctrl+F5` or `Cmd+Shift+R`
7. Check browser DevTools → Network tab for failed script requests

### MongoDB Connection Error
**Error**: `MongoServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Verify `MONGODB_URI` is correct in `.env.local`
2. Check MongoDB Atlas IP whitelist includes your current IP
3. Ensure database credentials are correct
4. Test connection with: `node -e "const m = require('mongoose'); m.connect(process.env.MONGODB_URI).then(() => console.log('✓ Connected')).catch(e => console.error('✗', e.message))"`

### Port 3000 Already in Use
```bash
# Find and kill process (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Run `npm run lint` before committing
- Write descriptive commit messages
- Test on mobile and desktop
- Update README if adding features

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

You're free to use, modify, and distribute this code for personal and commercial projects.

---

## 📞 Support

### Resources
- **Clerk Documentation**: [https://clerk.com/docs](https://clerk.com/docs)
- **MongoDB Docs**: [https://docs.mongodb.com](https://docs.mongodb.com)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

### Report Issues
Found a bug? Have a suggestion?
- [Open an Issue](https://github.com/PriyanshA0/Secret-Speak/issues)
- [Start a Discussion](https://github.com/PriyanshA0/Secret-Speak/discussions)

---

## 🎨 Design Credit

UI/UX designed with modern principles:
- Dark theme for reduced eye strain
- Accessible color contrast ratios
- Mobile-first responsive design
- Smooth animations & transitions

---

## 🙏 Acknowledgments

- Inspired by campus-first anonymous platforms
- Built with ❤️ for college students
- Special thanks to the open-source community

---

## 🗓️ Roadmap

- [ ] Trending topics clickable filters
- [ ] Time-range toggle for trending (Today/Week/Month)
- [ ] Direct messaging between anonymous users
- [ ] Advanced moderation dashboard
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] AI content recommendations
- [ ] Gamification (badges, leaderboards)
- [ ] Integration with campus systems (course schedules, events)

---

**Made with 💜 by the SecretSpeak Team**

*Keep secrets, make friends, join the conversation.*
