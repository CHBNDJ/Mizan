# ⚖️ Mizan - Algerian Legal Platform

🌐 **Live site:** [https://mizan-dz.com](https://mizan-dz.com)

First platform connecting lawyers and clients in Algeria. Search, compare and contact qualified lawyers throughout Algeria.

## 🎯 Concept

Our Mizan platform allows citizens to search for lawyers by specialty, location and consult their profiles before contacting them.

## ✨ Complete features

### 🔍 Lawyer search

**Advanced filters**

- Search by legal specialty (30+ specialties available)
- Filter by wilaya and city
- Filter by years of experience
- Filter by gender
- Filter by spoken languages
- Sort by rating and number of reviews

**Results display**

- Lawyer cards with photo, name, specialties
- **Separate Google and Mizan ratings**
- Contact information (phone, email, office address)
- "Verified" badge for verified profiles
- Years of experience and bar registration
- Spoken languages

### ⭐ Review and rating system

**Dual rating system**

- **Google Reviews**: Display of Google Business ratings (if available)
- **Mizan Reviews**: Platform client ratings
- Separate and clear display of both sources
- Automatic real-time updates

**Review features**

- 1-5 star rating
- Text comments
- Automatic average calculation
- Review counter per source
- Automatic SQL trigger for updates
- Ratings recalculation API

### 👤 Detailed lawyer profiles

**Public information**

- Professional profile photo
- Complete information (last name, first name, title)
- Legal specialties
- **Google and Mizan ratings displayed separately**
- Bar registration and order number
- Years of experience
- Complete location (wilaya, city, office address)
- Contacts (landline, mobile, professional email)
- Spoken languages
- Review section with Google/Mizan separation

**Verification badge**

- Indication if profile is verified by administration
- Verification date
- Profile status (active/verified)

### 📧 Notification system

**Email notifications via Resend**

- Sending from custom domain: `noreply@mizan-dz.com`
- Professional HTML templates
- Notifications for new reviews
- Notifications for new messages
- User preference management
- Dedicated Supabase Edge Function

**Notification types**

- Client → Consultation submission confirmation
- Lawyer → New consultation received
- Lawyer → New Mizan review received
- Client → Lawyer has responded

### 🎨 Animations and UX

**GSAP Animations**

- Smooth scroll animations (ScrollTrigger)
- Progressive element entrances
- Transition effects on homepage
- Stagger animations for lists

**Animated counters**

- Homepage: Animated stats (number of lawyers, wilayas, etc.)
- Progressive counter effect (0 → final value)
- Intersection Observer for scroll triggering

### 💬 Consultation system

**For clients**

- Consultation request form
- Legal specialty selection
- Detailed description of legal issue
- Consultation status tracking
- Complete consultation history
- Messaging system with lawyer

**For lawyers**

- Dashboard with all received consultations
- Filter by status
- Automatic email notification
- Response interface
- Conversation history

### 🔐 Authentication system

**Differentiated registration**

- Separate registration for clients and lawyers
- Forms adapted according to user type
- Mandatory verification emails
- Encrypted passwords
- Secure sessions

### 👨‍💼 Lawyer dashboard

**Overview**

- Real-time statistics
- Activity charts
- **Google and Mizan ratings separation**
- Profile completion

**Consultation management**

- Complete consultation list
- Filter by status
- Direct response from dashboard
- Complete history

**Profile management**

- Professional information modification
- Profile photo upload
- Specialty modification
- Contact details management

### 🙋‍♂️ Client space

**Dashboard**

- Complete consultation history
- Real-time status of each request
- Response notifications
- Quick access to conversations

**Profile management**

- Personal information modification
- Profile photo upload
- Location modification
- Notification settings

### 📱 Public pages

**Homepage**

- **GSAP scroll animations**
- **Animated counters for stats**
- Platform presentation
- Quick search bar
- Dynamic statistics
- Recommended lawyers

**Search page**

- Advanced search form
- Grid results display
- **Separate Google/Mizan ratings on cards**
- Pagination
- Dynamic filters

**Legal pages**

- Terms of service
- Privacy policy
- Legal notices
- FAQ

### 🔧 Technical features

**Database**

- Automatic SQL trigger for ratings
- Real-time average updates
- Separation `rating_google` and `rating_mizan`
- Counters `reviews_count_google` and `reviews_count_mizan`

**API Routes**

- `/api/recalculate-ratings` - Ratings recalculation
- `/api/consultations/*` - Consultation management
- `/api/send-claim-code` - Profile claiming
- `/api/verify-code` - Code verification

**Edge Functions (Supabase)**

- `send-notification` - Resend email sending
- `delete-account` - Account deletion

### 🌍 Geographic coverage

**Covered wilayas**

- Algiers
- Oran
- Annaba
- Setif

**Database**

- 30+ verified lawyers
- Daily addition of new profiles
- Systematic verification

## 🛠️ Tech stack

**Frontend**

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- **GSAP + ScrollTrigger** (animations)
- Lucide Icons
- **react-intersection-observer** (animated counters)

**Backend**

- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth
- **Supabase Edge Functions**
- **Resend** (emails with custom domain)

**Hosting**

- Vercel (frontend + API)
- Supabase (database + edge functions)
- Resend (transactional emails)

## 🔍 SEO & Ranking

### Technical optimizations ✅

**Optimized metadata**

- Personalized titles per page
- Optimized meta descriptions
- Open Graph tags
- Canonical URLs
- Meta robots

**Dynamic sitemap.xml**

- Static pages + lawyer profiles
- Automatic updates
- Sitemaps.org compliant format
- **Access:** [/sitemap.xml](https://mizan-dz.com/sitemap.xml)

**Robots.txt**

- Optimal crawl configuration
- Private page blocking
- **Access:** [/robots.txt](https://mizan-dz.com/robots.txt)

**Schema.org (JSON-LD)**

- Organization Schema
- Lawyer Profile Schema
- Google Rich Snippets

**Analytics**

- Google Analytics 4 configured
- Google Search Console verified
- Vercel Analytics
- Supabase Logs

### SEO performance

**Speed**

- Loading time: < 2s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s

**Lighthouse scores**

- Performance: 95+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

## 📦 Local installation

```bash
# Clone the repo
git clone https://github.com/CHBNDJ/mizan.git
cd mizan

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start in development
pnpm dev
```

Open http://localhost:3000

## ⚙️ Configuration

Create a `.env.local` file with your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=Mizan <noreply@mizan-dz.com>

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@mizan-dz.com
```

## 🚀 Deployment

The project is automatically deployed on Vercel with each push to the `main` branch.

**Production**: https://mizan-dz.com

To deploy manually:

```bash
# Production build
pnpm build

# Start in production
pnpm start
```

## 📂 Project structure

```
mizan/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── lawyers/           # Lawyer profile pages
│   ├── search/            # Search page
│   ├── layout.tsx         # Main layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Sitemap generation
│   └── robots.ts          # Robots.txt configuration
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── cards/            # Cards (LawyerCard)
│   ├── reviews/          # Review system
│   ├── AnimatedCounter.tsx
│   └── Navigation.tsx
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   ├── email/            # Email config
│   └── lawyersData.ts    # Lawyers logic
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── public/               # Static assets
└── supabase/
    └── functions/        # Edge Functions
        ├── send-notification/
        └── delete-account/
```

## ✅ Next.js compliant structure

**Your structure perfectly follows Next.js 15 App Router conventions:**

✅ **App Router** (`/app`) - New routing system
✅ **API Routes** (`/app/api`) - Backend endpoints
✅ **Components** (`/components`) - Clear organization
✅ **Lib** (`/lib`) - Utilities and configs
✅ **Public** (`/public`) - Static assets
✅ **Types** (`/types`) - TypeScript definitions
✅ **Hooks** (`/hooks`) - Custom hooks

**Official reference:** [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

## 🔄 Development workflow

1. Create a branch for your feature

```bash
git checkout -b feature/my-new-feature
```

2. Develop and test locally

```bash
pnpm dev
```

3. Commit and push

```bash
git add .
git commit -m "feat: add my feature"
git push origin feature/my-new-feature
```

4. Create a Pull Request on GitHub

5. Merge into `main` → Automatic deployment

## 📞 Support

For any questions or issues:

- **Email:** contact@mizan-dz.com
- **Website:** [mizan-dz.com/contact](https://mizan-dz.com/contact)

---
