# CelebrationHub
## Full Stack MERN Student Project

🔗 **Live Demo:** https://celebration-hub-cve8.vercel.app/

CelebrationHub is a full-stack web application that allows users to create and share personalized digital celebration pages for occasions like birthdays, anniversaries, and achievements.

---

## Purpose

This project demonstrates:

- CRUD operations using MongoDB, Express, and Node.js
- Role-based access control (User and Admin)
- REST API architecture
- MongoDB schema design using Mongoose
- Frontend development using React
- File upload and cloud storage integration with Cloudinary
- User authentication with password hashing (bcrypt)
- Responsive UI design with Material-UI (MUI)

---

## Tech Stack

### Backend
- Node.js, Express.js
- MongoDB, Mongoose
- Cloudinary, Multer
- bcrypt, CORS

### Frontend
- React
- React Router
- Material-UI (MUI)
- Emotion
- Context API

---

## Architecture

**React App → REST API → Node.js + Express → MongoDB**

---

## Features

### User Features
- User registration and login
- Create celebration pages with images, audio, video, and themes
- Edit and delete own celebrations
- View all public celebrations
- Personal dashboard

### Admin Features
- View all users
- View all celebrations
- Moderate content

### Celebration Page Features
- Responsive design
- Media playback (images, audio, video)
- Confetti animations
- Shareable links

---

## Roles

- **User** – Creates and manages celebration pages
- **Admin** – Manages users and moderates content

---

## Deployment

- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas  
- **Media Storage:** Cloudinary  

---

## Setup Instructions

### Backend
```bash
cd backend
npm install
