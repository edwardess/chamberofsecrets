# 💎 Chamber of Secrets

**by The WFH Couple**

A modern, responsive FAQ knowledge base application built with Next.js, Firebase, and Tailwind CSS. Features a Circle.so-style interface with rich text editing, responsive design, and admin controls.

## ✨ Features

- **📱 Fully Responsive**: Works seamlessly across desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, professional interface with brown & cream branding
- **📝 Rich Text Editor**: Jodit editor with video embedding, formatting, and media support
- **🔐 Admin Controls**: Create, edit, and delete posts, spaces, and groups
- **🏷️ Tag System**: Organize content with flexible tagging
- **❤️ Engagement**: Heart/like system for posts
- **🎯 Search & Filter**: Find content quickly with tag filtering
- **📊 Analytics**: Track post engagement and user interactions

## 🚀 Tech Stack

- **Frontend**: Next.js 15.5.3, React, TypeScript
- **Styling**: Tailwind CSS v4, HeroUI (NextUI)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Editor**: Jodit React Editor
- **Animations**: Framer Motion
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edwardess/chamberofsecrets.git
   cd chamberofsecrets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Storage for file uploads
5. Update your `.env.local` with the configuration

### Admin Access
- First user to sign up automatically becomes admin
- Admin users can create/edit/delete content
- Admin users can manage spaces and groups

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **xs (475px+)**: Fine-tuned mobile adjustments
- **sm (640px+)**: Small tablets and large phones
- **md (768px+)**: Tablets
- **lg (1024px+)**: Desktop sidebar threshold
- **xl (1280px+)**: Large desktop optimizations

## 🎨 Customization

### Branding
- App title: "Chamber of Secrets" with 💎 emoji
- Color scheme: Brown & cream theme
- Typography: Inter font family

### Content Management
- Rich text editor with video embedding
- Image uploads with automatic optimization
- Tag-based organization system
- Heart/like engagement system

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 📄 License

This project is created by The WFH Couple. All rights reserved.

## 🤝 Contributing

This is a private project by The WFH Couple. For questions or support, please contact us.

## 📞 Support

For support or questions about Chamber of Secrets, please reach out to The WFH Couple.

---

**💎 Chamber of Secrets** - *Your knowledge base, organized and beautiful*