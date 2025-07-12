# Service Center Management System

A modern web application for managing automotive service center operations, built with Next.js, TypeScript, and Firebase.

## 🚀 Features

- **Authentication System** - Secure login/signup with Firebase Auth
- **Dashboard** - Overview of service center operations
- **Customer Management** - Add, edit, and manage customer information
- **Vehicle Management** - Track customer vehicles and service history
- **Appointment Scheduling** - Book and manage service appointments
- **Employee Management** - Manage staff and their roles
- **Service Tracking** - Monitor service status and completion
- **Search Functionality** - Quick search across customers, vehicles, and appointments
- **Network Management** - Manage service center network and locations
- **Settings** - Configure application preferences

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **UI Components**: Custom atomic design system
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd service_center
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Create a web app in your Firebase project
4. Copy the Firebase configuration

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
service_center/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (AuthLayout)/       # Authentication pages
│   │   ├── (MainLayout)/       # Main application pages
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── atoms/              # Basic UI components
│   │   ├── molecules/          # Composite components
│   │   ├── auth/               # Authentication components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utility libraries
│   │   └── api/                # API functions
│   └── firebaseConfig.ts       # Firebase configuration
├── public/                     # Static assets
└── package.json
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all Firebase environment variables
   - Deploy to all environments (Production, Preview, Development)

### Environment Variables in Vercel

Make sure to add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Firebase Setup

1. **Authentication**: Enable Email/Password authentication in Firebase Console
2. **Firestore Database**: Create a database in test mode or production mode
3. **Security Rules**: Configure Firestore security rules for your use case

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the Firebase Console for authentication and database setup
2. Verify environment variables are correctly set
3. Check the browser console for detailed error messages
4. Ensure all dependencies are properly installed

## 🔄 Updates

- Keep Firebase SDK versions updated
- Regularly update Next.js and other dependencies
- Monitor Firebase usage and quotas

