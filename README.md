# Fitness Tracker - MERN Stack Application

A comprehensive fitness tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users monitor their workouts, nutrition, health metrics, and fitness goals.

## 🚀 Features

### Core Functionality
- **Dashboard**: Overview of fitness stats and recent activities
- **Workout Tracking**: Log exercises, sets, reps, and weights
- **Nutrition Monitoring**: Track calories, macros, and meals
- **Health Metrics**: Record weight, blood pressure, heart rate, sleep
- **Progress Analytics**: Visual charts and trend analysis
- **Goal Setting**: Create and track fitness objectives

### Technical Features
- **Authentication**: Secure user registration and login
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic data visualization
- **Data Persistence**: MongoDB database with proper schemas
- **RESTful API**: Express.js backend with proper routing
- **Type Safety**: TypeScript for better development experience

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness-tracker
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string

### 5. Running the Application

#### Development Mode (Recommended)
```bash
# From the root directory
npm run dev
```
This runs both frontend and backend concurrently.

#### Separate Terminals
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health-check

## 🏗️ Project Structure

```
fitness-tracker/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── WorkoutTracker.tsx  # Workout logging
│   │   ├── NutritionTracker.tsx # Nutrition tracking
│   │   ├── HealthMetrics.tsx   # Health data
│   │   ├── Progress.tsx        # Analytics & charts
│   │   ├── Goals.tsx          # Goal management
│   │   └── Navigation.tsx      # Navigation bar
│   ├── data/                   # Static data
│   ├── types/                  # TypeScript definitions
│   ├── utils/                  # Utility functions
│   └── App.tsx                 # Main App component
├── server/                      # Backend Node.js application
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # User model
│   │   ├── Workout.js         # Workout model
│   │   └── Goal.js            # Goal model
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── workouts.js        # Workout CRUD
│   │   ├── goals.js           # Goal management
│   │   └── progress.js        # Analytics endpoints
│   ├── middleware/             # Custom middleware
│   │   └── auth.js            # JWT authentication
│   └── index.js               # Server entry point
└── package.json               # Dependencies and scripts
```

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run server` - Start backend server
- `npm run dev` - Start with nodemon (auto-restart)

### Combined Scripts
- `npm run dev` - Run both frontend and backend concurrently

## 🎯 Usage Guide

### 1. User Registration
- Create an account with basic profile information
- Set your fitness goals and activity level

### 2. Logging Workouts
- Navigate to the Workouts section
- Click "New Workout" to create a workout session
- Add exercises, sets, reps, and weights
- Save your workout with notes

### 3. Tracking Nutrition
- Go to the Nutrition section
- Select meals (breakfast, lunch, dinner, snacks)
- Add foods and track calories/macros
- Monitor daily nutrition goals

### 4. Recording Health Metrics
- Visit the Health section
- Log weight, blood pressure, heart rate
- Track sleep hours and stress levels
- View health insights and recommendations

### 5. Setting Goals
- Access the Goals section
- Create specific, measurable fitness goals
- Set deadlines and track progress
- Mark goals as completed when achieved

### 6. Viewing Progress
- Check the Progress dashboard
- View charts and trends over time
- Analyze workout frequency and nutrition patterns
- Monitor goal completion rates

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment files

## 🎨 Design Features

- **Modern UI**: Clean, professional design with Tailwind CSS
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Interactive Charts**: Visual progress tracking and analytics
- **Smooth Animations**: Micro-interactions for better UX
- **Consistent Theming**: Emerald green primary color scheme
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend Deployment (Heroku/Railway)
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the server directory

### Full-Stack Deployment
Consider using platforms like:
- **Railway** - Full-stack deployment
- **Render** - Free tier available
- **DigitalOcean App Platform** - Scalable hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify environment variables are set correctly
4. Check that all dependencies are installed
5. Review the API endpoints in your browser's network tab

For additional help, please open an issue in the repository.

---

**Happy Fitness Tracking! 💪**