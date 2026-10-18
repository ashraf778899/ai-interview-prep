# 🤖 AI-Powered Interview Preparation System (IPS)
> A Complete Full-Stack Web Application for College Mini Project (CSE / AI & DS)

---

## 📌 Project Overview
The **AI Interview Preparation System** is a responsive full-stack platform designed to help students and job seekers prepare for technical and HR interviews. It features **6 distinct categories** (Python, Java, C++, DSA, DBMS, and HR), offers instant AI evaluation (via OpenAI GPT-3.5) with an automatic keyword/content pattern-matching **demo evaluation fallback** when no API key is set, and provides detailed analytics on performance and progress.

---

## 🛠️ Tech Stack
- **Frontend:** React.js 18, Vite 5, React Router v6, Axios, Vanilla CSS with custom design system.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Local or MongoDB Atlas) with Mongoose ORM.
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js password hashing.
- **AI Evaluation:** OpenAI API (`gpt-3.5-turbo`) with fallback pattern-matching algorithm.

---

## 📂 Project Structure
```
c:\AI based IPS\
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hook
│   │   ├── Question.js           # Question schema & categories
│   │   └── Interview.js          # Interview results & evaluation schema
│   ├── routes/
│   │   ├── authRoutes.js         # Register, Login, Me endpoints
│   │   ├── questionRoutes.js     # Category questions & seeding
│   │   ├── interviewRoutes.js    # AI & Demo evaluation, history, stats
│   │   └── userRoutes.js         # Profile update & password change
│   ├── .env                      # Active environment configuration
│   ├── .env.example              # Template environment variables
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── index.html                # Single Page App HTML template
    ├── vite.config.js            # Vite configuration & API proxy
    ├── package.json              # Frontend dependencies & scripts
    ├── .env                      # Active API URL configuration
    ├── .env.example              # Template environment variables
    └── src/
        ├── main.jsx              # React DOM mounting
        ├── App.jsx               # Routes & Auth wrappers
        ├── context/
        │   └── AuthContext.jsx   # Global user auth state
        ├── utils/
        │   └── api.js            # Axios client with interceptors
        ├── components/
        │   ├── Layout/
        │   │   ├── Layout.jsx    # Responsive wrapper
        │   │   └── Sidebar.jsx   # Dark navy sidebar & mobile drawer
        │   └── UI/
        │       ├── Toast.jsx     # Auto-dismiss alert toasts
        │       └── LoadingSpinner.jsx # Modern SVG loading spinner
        ├── pages/
        │   ├── LandingPage.jsx   # Public introduction & features
        │   ├── LoginPage.jsx     # Email/password authentication
        │   ├── RegisterPage.jsx  # Registration with validation
        │   ├── Dashboard.jsx     # User statistics & category shortcuts
        │   ├── CategorySelect.jsx# 6 categories with details
        │   ├── InterviewPage.jsx # Timed interview question runner
        │   ├── ResultsPage.jsx   # Detailed score, feedback & review
        │   ├── HistoryPage.jsx   # Filterable past interview table
        │   └── ProfilePage.jsx   # User details & password change
        └── styles/
            ├── global.css
            ├── Sidebar.css
            ├── Layout.css
            ├── Toast.css
            ├── LoadingSpinner.css
            ├── LandingPage.css
            ├── AuthPages.css
            ├── Dashboard.css
            ├── CategorySelect.css
            ├── InterviewPage.css
            ├── ResultsPage.css
            ├── HistoryPage.css
            └── ProfilePage.css
```

---

## 🚀 Quick Setup Instructions

### Prerequisites
1. **Node.js** (v16 or higher) installed on your system.
2. **MongoDB** installed locally, OR a free **MongoDB Atlas** cluster URI.

### Step 1: Install Backend Dependencies
Open your terminal:
```bash
cd "c:\AI based IPS\backend"
npm install
```

### Step 2: Install Frontend Dependencies
Open a second terminal:
```bash
cd "c:\AI based IPS\frontend"
npm install
```

### Step 3: Configure Environment Variables
- **Backend:** `backend/.env` is pre-configured for local MongoDB (`mongodb://127.0.0.1:27017/ai_interview_db`). If using Atlas, replace `MONGO_URI` with your connection string. If you have an OpenAI key, set `OPENAI_API_KEY=sk-...` (if left blank, the built-in demo evaluator will seamlessly handle scoring and feedback).
- **Frontend:** `frontend/.env` is already configured to connect to `http://localhost:5000/api`.

### Step 4: Run the Application
1. **Start Backend Server:**
   ```bash
   cd "c:\AI based IPS\backend"
   npm run dev
   # Or: npm start
   ```
   *Expected output: `Server running on http://localhost:5000` & `MongoDB Connected`.*

2. **Start Frontend Development Server:**
   ```bash
   cd "c:\AI based IPS\frontend"
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

## 🧪 Testing Checklist
1. **Register:** Go to `http://localhost:5173/register` and create an account.
2. **Login:** Test authentication at `/login`.
3. **Seed Database:** The questions route automatically serves pre-loaded static questions and seeds them dynamically. You can also trigger `http://localhost:5000/api/questions/seed` once in your browser or Postman.
4. **Take Interview:** Click **Practice** in the sidebar, choose any of the 6 categories (Python, Java, C++, DSA, DBMS, HR), answer the questions, and submit.
5. **View Results:** Inspect your percentage, grade badge, AI/Demo badge, strengths, improvements, and collapsible per-question feedback.
6. **Check History & Dashboard:** Verify that completed sessions appear in the **Dashboard** metrics and **History** page.
