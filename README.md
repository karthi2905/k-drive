# 🚀 K-Drive - Professional Google Drive Clone

A modern, feature-rich cloud storage application built with Next.js 15, TypeScript, and Tailwind CSS. K-Drive provides a professional Google Drive-like experience with file management, folder organization, and beautiful UI.

![K-Drive](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### Core Functionality
- ✅ **File Management**: Upload, download, delete, rename files
- ✅ **Folder Organization**: Create, navigate, and manage nested folders
- ✅ **Multiple Views**: Grid and list view modes
- ✅ **Drag & Drop Upload**: Intuitive file upload with drag-and-drop
- ✅ **File Preview**: Image previews and file type icons
- ✅ **Search**: Quick search across all files and folders
- ✅ **Starred Items**: Mark important files for quick access
- ✅ **Trash/Recycle Bin**: Soft delete with restore functionality
- ✅ **Recent Files**: View recently accessed items
- ✅ **Shared Files**: Manage files shared with you

### UI/UX Features
- 🎨 **Modern Design**: Beautiful gradient-based UI with glassmorphism
- 🌙 **Dark Mode**: Automatic dark mode support
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast**: Optimized performance with Next.js 15
- 🎯 **Intuitive**: Context menus, breadcrumbs, and keyboard shortcuts
- 💫 **Smooth Animations**: Polished transitions and hover effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **File Upload**: React Dropzone
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Backend** (Ready to integrate): Supabase

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository** (if not already done)
   ```bash
   cd d:\projects\drive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The project includes a `.env.local` file. To connect to a real backend:
   
   - Sign up for [Supabase](https://supabase.com) (free tier available)
   - Create a new project
   - Get your project URL and anon key from Settings > API
   - Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
drive/
├── app/                      # Next.js App Router pages
│   ├── drive/               # Main drive page
│   ├── shared/              # Shared files page
│   ├── recent/              # Recent files page
│   ├── starred/             # Starred items page
│   ├── trash/               # Trash/bin page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (redirects to /drive)
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── modal.tsx
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── header.tsx           # Top header with search
│   ├── file-card.tsx        # File display card
│   ├── folder-card.tsx      # Folder display card
│   ├── upload-modal.tsx     # File upload modal
│   ├── new-folder-modal.tsx # Create folder modal
│   └── breadcrumbs.tsx      # Folder navigation
├── lib/                     # Utility libraries
│   ├── utils.ts             # Helper functions
│   └── supabase.ts          # Supabase client & types
├── store/                   # State management
│   └── useAppStore.ts       # Zustand store
├── types/                   # TypeScript types
│   └── index.ts
└── public/                  # Static assets

```

## 🎯 Current Status

### ✅ Completed
- [x] Project setup and configuration
- [x] Modern UI design system
- [x] Sidebar navigation
- [x] Header with search and actions
- [x] File and folder card components
- [x] Grid and list view modes
- [x] Upload modal with drag-and-drop
- [x] New folder creation
- [x] Breadcrumb navigation
- [x] All main pages (Drive, Shared, Recent, Starred, Trash)
- [x] State management with Zustand
- [x] Mock data for demonstration
- [x] Responsive design
- [x] Dark mode support

### 🔄 Ready to Implement (Backend Integration)

The frontend is **100% complete** and functional with mock data. To make it production-ready:

1. **Set up Supabase Database**
   - Create tables for files, folders, and shared items
   - Set up storage buckets for file uploads
   - Configure authentication

2. **Replace Mock Data with API Calls**
   - Connect to Supabase in each page
   - Implement real file upload to storage
   - Add authentication flow

3. **Additional Features** (Optional)
   - File sharing with permissions
   - Real-time collaboration
   - File versioning
   - Activity logs
   - Storage quota management

## 🚀 Usage

### Uploading Files
1. Click the "Upload" button in the header
2. Drag and drop files or click to browse
3. Select multiple files if needed
4. Click "Upload" to confirm

### Creating Folders
1. Click "New Folder" in the header
2. Enter a folder name
3. Click "Create"

### Managing Files
- **Star**: Click the star icon to mark as favorite
- **Delete**: Use the context menu (three dots) to delete
- **Download**: Click download from the context menu
- **Preview**: Click on a file to preview (images show thumbnails)

### Navigation
- Use the sidebar to switch between views
- Click on folders to navigate inside
- Use breadcrumbs to go back to parent folders

## 🎨 Design Philosophy

K-Drive follows modern web design principles:

- **Vibrant Colors**: Gradient-based color scheme with blue and purple
- **Glassmorphism**: Subtle transparency and blur effects
- **Micro-animations**: Smooth transitions on hover and interactions
- **Consistent Spacing**: 8px grid system for alignment
- **Typography**: System fonts for optimal readability
- **Accessibility**: Focus states and keyboard navigation

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration in `tailwind.config.ts`. Dark mode is set to use media queries.

### TypeScript
Strict mode is enabled for type safety. All components are fully typed.

### Next.js
- App Router for modern routing
- Turbopack for faster development
- Image optimization enabled

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Cloudflare Pages

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Design inspired by Google Drive
- Icons by [Lucide](https://lucide.dev)
- Built with [Next.js](https://nextjs.org)

---

**Made with ❤️ by Karthikeyan R**

For questions or support, please open an issue on GitHub.
