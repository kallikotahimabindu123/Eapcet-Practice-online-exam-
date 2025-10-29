# 🚀 Local Development Setup Guide

## 📋 **Prerequisites**

Before setting up locally, make sure you have:
- **Node.js** (v16 or higher) - Download from https://nodejs.org
- **Git** (optional) - For version control
- **Code Editor** - VS Code recommended

## 🛠️ **Step 1: Download Project Files**

### **Option A: Download from Bolt (Current)**
1. In Bolt, click the **download button** (⬇️) in the top-right
2. Extract the ZIP file to your desired folder
3. Open the folder in VS Code

### **Option B: Manual Setup**
1. Create a new folder: `eapcet-online-test`
2. Copy all files from this Bolt project
3. Open in VS Code

## 🔧 **Step 2: Install Dependencies**

Open terminal in your project folder and run:

```bash
# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
```

## 🔑 **Step 3: Setup Environment Variables**

1. **Create `.env` file** in project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Get your Supabase credentials:**
   - Go to https://supabase.com
   - Select your project
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public key**

## 🗄️ **Step 4: Setup Database**

Your Supabase database is already configured! The tables are:
- `users` - Student/admin profiles
- `exams` - Exam metadata  
- `questions` - Question bank
- `exam_submissions` - Results
- `exam_assignments` - Student assignments
- `notifications` - System notifications
- `activity_logs` - Audit trail
- `certificates` - Auto-generated certificates
- `proctoring_data` - Security photos
- `practice_sessions` - Practice mode data

## 🚀 **Step 5: Run Locally**

```bash
# Start development server
npm run dev

# Your app will open at:
# http://localhost:5173
```

## 🌐 **Step 6: Build for Production**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 **Project Structure**

```
eapcet-online-test/
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Main pages
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── lib/                # Supabase client
│   └── data/               # Mock data
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json           # Dependencies
```

## 🔐 **Default Login Credentials**

### **Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

### **Student Account:**
- Email: `student@example.com`
- Password: `password123`

## 🎯 **Features Available Locally**

✅ **Complete Authentication System**
✅ **Webcam Monitoring & Photo Capture**
✅ **Real-time Database with Supabase**
✅ **Admin Dashboard with Analytics**
✅ **Student Registration & Exam Taking**
✅ **Excel Question Upload**
✅ **Security Monitoring**
✅ **Mobile Responsive Design**
✅ **Notification System**
✅ **Certificate Generation**

## 🚀 **Deploy Your Own Version**

### **Option 1: Netlify (Recommended)**
1. Build your project: `npm run build`
2. Go to https://netlify.com
3. Drag & drop the `dist` folder
4. Add environment variables in Netlify settings

### **Option 2: Vercel**
1. Go to https://vercel.com
2. Import your project
3. Add environment variables
4. Deploy automatically

### **Option 3: Your Own Server**
1. Build: `npm run build`
2. Upload `dist` folder to your web server
3. Configure environment variables

## 🔧 **Customization**

### **Change Branding:**
- Edit `src/pages/HomePage.tsx` for landing page
- Update `index.html` for title and favicon
- Modify `package.json` for project details

### **Add Features:**
- All components are modular
- Add new pages in `src/pages/`
- Create new components in `src/components/`
- Database schema in `supabase/migrations/`

## 📞 **Support**

If you face any issues:
1. Check console for errors
2. Verify environment variables
3. Ensure Supabase connection is working
4. Check Node.js version (v16+)

## 🎉 **You're Ready!**

Your EAPCET Online Test Platform is now running locally with:
- ✅ No "Made with Bolt" branding
- ✅ Full control over code
- ✅ Can deploy anywhere
- ✅ Customize as needed
- ✅ Production-ready features