# CelebrationHub — MERN Student Project
**Digital Celebration Platform**

🔗 **Live Demo:** https://celebration-hub-cve8.vercel.app/

---

## 1. Introduction

### 1.1 Purpose
This document defines the end-to-end technical design and implementation of **CelebrationHub**, a full-stack web application that allows users to create and share personalized digital celebration pages for occasions like birthdays, anniversaries, and achievements.

### 1.2 Target Audience
- Students learning MERN stack development
- Developers exploring full-stack architecture
- Anyone interested in building media-rich web applications

### 1.3 Learning Outcomes
- CRUD operations using MongoDB, Express, and Node.js
- Role-based access control (User and Admin)
- REST API architecture
- MongoDB schema design using Mongoose
- Frontend development using React
- File upload and cloud storage integration with Cloudinary
- User authentication with password hashing (bcrypt)
- JWT-based authentication
- Responsive UI design with Material-UI (MUI)

---

## 2. System Overview

### 2.1 User Roles

| Role  | Description                                      |
|-------|--------------------------------------------------|
| User  | Creates, edits, and manages own celebration pages |
| Admin | Views all users, moderates content, manages system |

### 2.2 Core Features

**User Features:**
- User registration and login with JWT authentication
- Create celebration pages with images, audio, video, and themes
- Edit and delete own celebrations
- View all public celebrations
- Personal dashboard

**Admin Features:**
- View all users
- Delete users
- View all celebrations
- Delete celebrations (content moderation)

**Celebration Page Features:**
- Responsive design
- Media playback (images, audio, video)
- Confetti animations
- Shareable links
- Custom themes
- Event date and time tracking

---

## 3. High-Level Architecture

```
[ React App ]
     |
     |------ REST API ------|
                            |
                   [ Node.js + Express ]
                            |
                      [ MongoDB ]
                            |
                   [ Cloudinary (Media Storage) ]
```

**Key Principle:** Separation of concerns with RESTful API design

---

## 4. Database Design (DB-First Approach)

### 4.1 Database
- **MongoDB Atlas** (Cloud) or Local MongoDB
- **ODM:** Mongoose

### 4.2 Collections

#### 4.2.1 users
```javascript
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed with bcrypt)",
  "role": "user | admin",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Indexes:** 
- `email` (unique)

#### 4.2.2 celebrations
```javascript
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "title": "string",
  "message": "string",
  "eventDate": "Date",
  "eventTime": "string",
  "images": ["string (Cloudinary URLs)"],
  "audio": "string (Cloudinary URL)",
  "audioStartTime": "number",
  "video": "string (Cloudinary URL)",
  "theme": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Indexes:**
- `userId`
- `eventDate`

---

## 5. Backend Design (Node.js + Express)

### 5.1 Technology Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary (Media Storage)
- Multer (File Upload)
- JWT Authentication
- bcrypt (Password Hashing)
- CORS

### 5.2 Backend Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── celebrationController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── Users.js
│   │   └── Celebration.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── celebrationRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   └── index.js
├── uploads/
├── .env
├── .env.example
├── package.json
└── .gitignore
```

### 5.3 Authentication Flow
1. User registers with name, email, and password
2. Password is hashed using bcrypt
3. User logs in with email and password
4. Backend validates credentials
5. JWT token is issued with user ID and role
6. Token is sent to frontend and stored
7. Protected routes verify JWT token via middleware

### 5.4 API Endpoints

#### Auth & User APIs
| Method | Endpoint       | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| POST   | /users         | Register new user    | No            |
| POST   | /login         | User login           | No            |
| GET    | /users         | Get all users        | No            |

#### Celebration APIs
| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | /celebrations         | Get all celebrations     | No            |
| GET    | /celebrations/:id     | Get celebration by ID    | No            |
| POST   | /celebrations         | Create celebration       | Yes           |
| PUT    | /celebrations/:id     | Update celebration       | Yes           |
| DELETE | /celebrations/:id     | Delete celebration       | Yes           |

#### Admin APIs
| Method | Endpoint                    | Description                  | Auth Required |
|--------|-----------------------------|------------------------------|---------------|
| GET    | /admin/users                | Get all users (admin)        | Yes (Admin)   |
| DELETE | /admin/users/:id            | Delete user (admin)          | Yes (Admin)   |
| GET    | /admin/celebrations         | Get all celebrations (admin) | Yes (Admin)   |
| DELETE | /admin/celebrations/:id     | Delete celebration (admin)   | Yes (Admin)   |

### 5.5 Role-Based Access Control
- Middleware validates JWT token
- User role is extracted from token
- Admin-only routes check for admin role
- Users can only modify their own celebrations

---

## 6. Frontend Design (React)

### 6.1 Tech Stack
- React
- React Router
- Material-UI (MUI)
- Emotion (CSS-in-JS)
- Context API (State Management)
- Axios (HTTP Client)
- Canvas Confetti (Animations)

### 6.2 Folder Structure
```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── CelebrationCard.js
│   │   └── ProtectedRoute.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── CreateCelebration.js
│   │   ├── EditCelebration.js
│   │   ├── CelebrationView.js
│   │   ├── Dashboard.js
│   │   └── AdminDashboard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   ├── theme.js
│   └── config.js
├── .env
├── .env.example
├── package.json
└── .gitignore
```

### 6.3 Key Pages
- **Home:** Browse all celebrations
- **Login/Register:** User authentication
- **Dashboard:** User's own celebrations
- **Create/Edit Celebration:** Form with media upload
- **Celebration View:** Display celebration with media playback
- **Admin Dashboard:** Manage users and celebrations

---

## 7. Media Integration (Cloudinary)

### 7.1 Current Implementation
- Accept image, audio, and video uploads
- Store media files on Cloudinary
- Return Cloudinary URLs to frontend
- Display media using URLs

### 7.2 File Upload Configuration
```javascript
// Multer configuration with Cloudinary storage
upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }
])
```

### 7.3 Supported Media Types
- **Images:** JPEG, PNG, GIF (up to 20 images)
- **Audio:** MP3, WAV
- **Video:** MP4, WebM

---

## 8. Security Considerations

- **Password Security:** bcrypt hashing with salt rounds
- **JWT Authentication:** Secure token-based auth
- **Role-Based Authorization:** Middleware protection
- **Input Validation:** Server-side validation
- **CORS Configuration:** Controlled cross-origin access
- **Environment Variables:** Sensitive data in .env files
- **File Upload Limits:** Multer file size restrictions

---

## 9. Deployment

### 9.1 Deployment Architecture
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Media Storage:** Cloudinary

### 9.2 Environment Variables

**Backend (.env):**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend (.env):**
```
REACT_APP_API_URL=https://your-backend.render.com
```

---

## 10. Setup Instructions

### 10.1 Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account
- Git

### 10.2 Backend Setup
```bash
cd backend
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials

# Start development server
npm run dev

# Start production server
npm start
```

### 10.3 Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your backend API URL

# Start development server
npm start

# Build for production
npm run build
```

### 10.4 Database Setup
1. Create MongoDB Atlas account or install MongoDB locally
2. Create a new database named `celebrationhub`
3. Copy connection string to backend .env file
4. Collections will be created automatically on first use

---

## 11. Development Workflow

### 11.1 Recommended Practices
- Use meaningful variable and function names
- Write comments for complex logic
- Test API endpoints using Postman or Thunder Client
- Use Git for version control
- Follow REST API conventions
- Validate user input on both frontend and backend

### 11.2 Testing
- Test user registration and login
- Test celebration CRUD operations
- Test file uploads with different media types
- Test role-based access control
- Test responsive design on different devices

---

## 12. Future Enhancements

- Email notifications for event reminders
- Social media sharing integration
- Advanced theme customization
- Comment system for celebrations
- Like/reaction system
- Search and filter functionality
- User profile pages
- Multi-language support
- Real-time notifications using WebSockets
- Analytics dashboard for admins

---

## 13. Conclusion

CelebrationHub demonstrates a complete full-stack MERN application with authentication, file uploads, role-based access control, and cloud storage integration. It serves as a practical learning project for understanding modern web development practices and technologies.
