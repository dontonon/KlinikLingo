# KlinikLingo - German Learning Platform for Healthcare Professionals

A comprehensive web-based German learning platform following the Goethe Institut curriculum (A1-C2 levels) with integrated healthcare and nursing vocabulary.

## 🎯 Features

- **Dual-Track Learning**: Each lesson combines everyday German conversation with specialized healthcare vocabulary
- **Complete A1 & A2 Content**: Full curriculum with vocabulary, grammar, and interactive exercises
- **Interactive Exercises**: Flashcards, fill-in-the-blanks, matching games, and quizzes
- **Progress Tracking**: Save your progress and track completion across all lessons
- **Mobile-Responsive**: Beautiful, clean design that works on all devices
- **User Authentication**: Secure login and personal progress tracking

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Heroicons** for UI icons

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** authentication
- **bcrypt** for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd KlinikLingo
```

### 2. Set Up the Database

Create a PostgreSQL database:

```bash
createdb kliniklingo
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=kliniklingo
# DB_USER=postgres
# DB_PASSWORD=your_password

# Initialize database schema
npm run init-db

# Seed database with lessons
npm run seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage

1. **Register an Account**: Create your account on the registration page
2. **Explore the Dashboard**: View all available levels and your progress
3. **Start Learning**: Begin with A1 lessons and work your way up
4. **Complete Exercises**: Practice with interactive exercises in each lesson
5. **Track Progress**: Mark lessons as complete and see your scores

## 🎓 Curriculum Structure

### A1 Level (Complete)
- Greetings and Introductions
- Numbers and Personal Information
- _(More lessons available in the platform)_

### A2 Level (Complete)
- Daily Routines and Schedules
- Health and Body Parts
- Medical Procedures
- _(More lessons available in the platform)_

### B1-C2 Levels
- Structure in place, content coming soon

## 🗄️ Database Schema

### Users
- Authentication and profile information
- Current learning level tracking

### Lessons
- Lesson content (vocabulary, grammar, exercises)
- Level and ordering information
- Placeholder status

### User Progress
- Completion status
- Scores
- Time tracking

### Exercise Results
- Individual exercise performance
- Historical tracking

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kliniklingo
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Vercel (Frontend)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL
4. Deploy!

### Railway/Render (Backend)

1. Create a new service
2. Connect your GitHub repository
3. Set environment variables
4. Add a PostgreSQL database
5. Run migrations: `npm run init-db`
6. Seed data: `npm run seed`
7. Deploy!

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/lessons/level/:level` - Get lessons by level

### Progress
- `GET /api/progress` - Get user's overall progress
- `POST /api/progress/lesson/:id` - Update lesson progress
- `POST /api/progress/exercise` - Save exercise result

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Goethe Institut for curriculum guidelines
- Healthcare terminology resources
- All contributors and testers

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for healthcare professionals learning German**
