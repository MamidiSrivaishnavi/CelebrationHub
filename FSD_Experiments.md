# CelebrationHub - Full Stack Development Experiments

**Roll No:** [Your Roll Number]  
**Date:** [Date]  
**Project:** CelebrationHub - Digital Celebration Pages Platform

---

## Experiment 1: Set up the Node.js environment for the CelebrationHub backend and display a basic server response

### AIM
Set up the Node.js environment for the CelebrationHub backend and display a basic server response.

### Description
This experiment demonstrates the basic setup of a Node.js environment using the CelebrationHub backend application. The Express server is initialized and a simple root route is created to verify successful configuration. When the server runs, it returns a basic text response confirming that the backend environment is installed, connected, and ready for further development.

### Source Code

**File: `backend/server.js`**

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const userRoutes = require("./routes/userRoutes");
const celebrationRoutes = require("./routes/celebrationRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/celebrations", celebrationRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CelebrationHub Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### OUTPUT
**Note:** Take a screenshot showing:
- Terminal with message: `Server running on port 5000` and `MongoDB Connected`
- Browser or Postman showing `http://localhost:5000/` returning "CelebrationHub Backend Running"

---

## Experiment 2: Develop a Node.js based user login system for the CelebrationHub application

### AIM
Develop a Node.js based user login system for the CelebrationHub application.

### Description
This experiment implements a user login system using Node.js, Express, and MongoDB. It validates user credentials and checks encrypted passwords with bcrypt. The CelebrationHub project uses this module for secure authentication of users and admins. It shows how backend login logic can be used to control access to protected application features.

### Source Code

**File: `backend/src/routes/userRoutes.js`**

```javascript
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.post("/login", userController.loginUser);
module.exports = router;
```

**File: `backend/src/controllers/userController.js`**

```javascript
const User = require("../models/Users");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
};
```

**File: `backend/src/models/Users.js`**

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

### OUTPUT
**Note:** Take a screenshot showing:
- Postman POST request to `http://localhost:5000/login`
- Request body with email and password
- Response showing success message and user object (without password)

---

## Experiment 3: Write a Node.js program to insert and remove CelebrationHub project data using backend scripts

### AIM
Write a Node.js program to insert and remove CelebrationHub project data using backend scripts.

### Description
This experiment focuses on performing data operations in Node.js. In CelebrationHub, these actions are handled through MongoDB scripts. The seed and reset scripts insert sample records and remove existing records from the database. It demonstrates programmatic data management for application setup and testing.

### Source Code

**File: `backend/seed.js`**

```javascript
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./utils/db");
const User = require("./models/User");

connectDB();

const seed = async () => {
  await User.deleteMany();

  const password = await bcrypt.hash("Password123", 10);

  await User.create([
    {
      name: "John Doe",
      email: "user@gmail.com",
      role: "user",
      password
    },
    {
      name: "Admin User",
      email: "admin@gmail.com",
      role: "admin",
      password
    }
  ]);

  console.log("Seed data inserted");
  console.log("Default password for all seeded users: Password123");
  process.exit();
};

seed();
```

**File: `backend/resetData.js`**

```javascript
require("dotenv").config();
const connectDB = require("./utils/db");
const User = require("./models/User");
const Celebration = require("./models/Celebration");

connectDB();

const resetData = async () => {
  await Celebration.deleteMany();
  await User.deleteMany();

  console.log("All users and celebrations have been removed.");
  process.exit();
};

resetData();
```

### OUTPUT
**Note:** Take a screenshot showing:
- Terminal running `node backend/seed.js` with success message
- MongoDB Compass or terminal showing inserted users
- Terminal running `node backend/resetData.js` showing deletion confirmation

---

## Experiment 4: Implement HTTP request and response handling for the CelebrationHub API

### AIM
Implement HTTP request and response handling for the CelebrationHub celebration creation API.

### Description
This experiment shows how Node.js handles HTTP requests and responses through backend routes. In CelebrationHub, celebration pages are created through API endpoints using Express. The server receives request data, validates it, processes it, and returns a JSON response. It highlights the request-response cycle used in modern web application backends.

### Source Code

**File: `backend/routes/celebrationRoutes.js`**

```javascript
const express = require("express");
const {
  createCelebration,
  getMyCelebrations,
  getAllCelebrations,
  getCelebrationById,
  updateCelebration,
  deleteCelebration
} = require("../controllers/celebrationController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("user", "admin"), createCelebration);
router.get("/mine", protect, authorize("user", "admin"), getMyCelebrations);
router.get("/", getAllCelebrations);
router.get("/:id", getCelebrationById);
router.put("/:id", protect, authorize("user", "admin"), updateCelebration);
router.delete("/:id", protect, authorize("user", "admin"), deleteCelebration);

module.exports = router;
```

**File: `backend/controllers/celebrationController.js`**

```javascript
const Celebration = require("../models/Celebration");
const User = require("../models/User");

exports.createCelebration = async (req, res) => {
  try {
    const { title, occasion, date, message, theme } = req.body;

    if (!title || !occasion || !date || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const celebrationDate = new Date(date);

    if (Number.isNaN(celebrationDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        message: "Message must be at least 10 characters long"
      });
    }

    const celebration = await Celebration.create({
      createdBy: req.user._id,
      title: title.trim(),
      occasion,
      date: celebrationDate,
      message: message.trim(),
      theme: theme || "default"
    });

    const populatedCelebration = await Celebration.findById(celebration._id)
      .populate("createdBy", "name email role");

    res.status(201).json(populatedCelebration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyCelebrations = async (req, res) => {
  try {
    const celebrations = await Celebration.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(celebrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCelebrations = async (req, res) => {
  try {
    const query = {};

    if (req.query.occasion && req.query.occasion !== "All") {
      query.occasion = req.query.occasion;
    }

    const celebrations = await Celebration.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(celebrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### OUTPUT
**Note:** Take a screenshot showing:
- Postman POST request to `http://localhost:5000/api/celebrations`
- Request body with celebration details (title, occasion, date, message)
- Response showing created celebration with populated user data

---

## Experiment 5: Connect the CelebrationHub project to MongoDB and define the required database collections

### AIM
Connect the CelebrationHub project to MongoDB and define the required database collections.

### Description
This experiment demonstrates the use of MongoDB databases and collections in the CelebrationHub project. The application connects to MongoDB and defines schemas for users and celebrations using Mongoose. These schemas represent structured collections that store authentication and celebration information. It explains how database connection and collection design support the project's data layer.

### Source Code

**File: `backend/utils/db.js`**

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**File: `backend/models/User.js`**

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true
    },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

**File: `backend/models/Celebration.js`**

```javascript
const mongoose = require("mongoose");

const celebrationSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true, trim: true },
    occasion: {
      type: String,
      enum: ["Birthday", "Anniversary", "Achievement", "Graduation", "Other"],
      required: true
    },
    date: { type: Date, required: true },
    message: { type: String, required: true, minlength: 10, trim: true },
    theme: {
      type: String,
      enum: ["default", "birthday", "anniversary", "achievement", "festive"],
      default: "default"
    },
    images: [{ type: String }],
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Celebration", celebrationSchema);
```

### OUTPUT
**Note:** Take a screenshot showing:
- MongoDB Compass with `celebrationhub` database
- Two collections: `users` and `celebrations`
- Sample document structure from each collection

---

## Experiment 6: Implement CRUD operations for CelebrationHub users and celebrations using MongoDB

### AIM
Implement CRUD operations for CelebrationHub users and celebrations using MongoDB.

### Description
This experiment implements CRUD operations using MongoDB in the CelebrationHub system. Users can be registered, celebration pages can be created, records can be viewed, updated, and deleted. It clearly demonstrates the complete lifecycle of data management in a real project.

### Source Code

**File: `backend/controllers/authController.js`**

```javascript
const createUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return { error: { status: 409, message: "User already exists" } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  return { user };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || "user";

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const result = await createUser({ name, email, password, role });

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message
      });
    }

    res.status(201).json({
      message: "Registration successful",
      user: sanitizeUser(result.user)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**File: `backend/controllers/celebrationController.js`**

```javascript
// CREATE
exports.createCelebration = async (req, res) => {
  try {
    const { title, occasion, date, message, theme } = req.body;

    if (!title || !occasion || !date || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const celebration = await Celebration.create({
      createdBy: req.user._id,
      title: title.trim(),
      occasion,
      date: new Date(date),
      message: message.trim(),
      theme: theme || "default"
    });

    res.status(201).json(celebration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ
exports.getMyCelebrations = async (req, res) => {
  try {
    const celebrations = await Celebration.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(celebrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCelebrations = async (req, res) => {
  try {
    const query = { isPublic: true };

    if (req.query.occasion && req.query.occasion !== "All") {
      query.occasion = req.query.occasion;
    }

    const celebrations = await Celebration.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(celebrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateCelebration = async (req, res) => {
  try {
    const { title, occasion, date, message, theme } = req.body;

    const celebration = await Celebration.findById(req.params.id);

    if (!celebration) {
      return res.status(404).json({ message: "Celebration not found" });
    }

    if (celebration.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    celebration.title = title || celebration.title;
    celebration.occasion = occasion || celebration.occasion;
    celebration.date = date || celebration.date;
    celebration.message = message || celebration.message;
    celebration.theme = theme || celebration.theme;

    await celebration.save();

    res.json(celebration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteCelebration = async (req, res) => {
  try {
    const celebration = await Celebration.findById(req.params.id);

    if (!celebration) {
      return res.status(404).json({ message: "Celebration not found" });
    }

    if (celebration.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await celebration.deleteOne();

    res.json({ message: "Celebration deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

**File: `backend/routes/userRoutes.js`**

```javascript
const express = require("express");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### OUTPUT
**Note:** Take a screenshot showing:
- Postman requests demonstrating:
  - POST /api/celebrations (Create)
  - GET /api/celebrations/mine (Read)
  - PUT /api/celebrations/:id (Update)
  - DELETE /api/celebrations/:id (Delete)
- MongoDB Compass showing the changes reflected in the database

---

## Experiment 7: Perform count and sorting operations on CelebrationHub records using MongoDB queries

### AIM
Perform count and sorting operations on CelebrationHub celebration records using MongoDB queries.

### Description
This experiment explores MongoDB operations such as count and sort on application data. In CelebrationHub, celebration records are sorted by creation date and counted to generate dashboard summaries. These operations help organize records and present useful statistics to the user.

### Source Code

**File: `backend/controllers/celebrationController.js`**

```javascript
exports.getMyCelebrations = async (req, res) => {
  try {
    const celebrations = await Celebration.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(celebrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCelebrations = async (req, res) => {
  try {
    const query = { isPublic: true };

    if (req.query.occasion && req.query.occasion !== "All") {
      query.occasion = req.query.occasion;
    }

    const celebrations = await Celebration.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(celebrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalCelebrations = await Celebration.countDocuments({
      createdBy: userId
    });

    const birthdayCount = await Celebration.countDocuments({
      createdBy: userId,
      occasion: "Birthday"
    });

    const anniversaryCount = await Celebration.countDocuments({
      createdBy: userId,
      occasion: "Anniversary"
    });

    const achievementCount = await Celebration.countDocuments({
      createdBy: userId,
      occasion: "Achievement"
    });

    res.json({
      total: totalCelebrations,
      birthday: birthdayCount,
      anniversary: anniversaryCount,
      achievement: achievementCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### OUTPUT
**Note:** Take a screenshot showing:
- Postman GET request to `/api/celebrations` showing sorted results (newest first)
- Dashboard stats showing count of celebrations by occasion type
- MongoDB Compass query showing count operations

---

## Experiment 8: Develop a styled CelebrationHub signup form and handle user input events in the frontend

### AIM
Develop a styled CelebrationHub signup form and handle user input events in the frontend.

### Description
This experiment demonstrates a styled form with event handling in the frontend. CelebrationHub uses a React signup form where CSS is applied for layout and appearance. User interactions such as typing and submitting are managed through `onChange` and `onSubmit` events. It shows how frontend forms respond dynamically to user input in a web application.

### Source Code

**File: `frontend/src/pages/Signup.js`**

```javascript
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", { name, email, password });
      setMessage("Account created successfully. You can log in now.");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="hero-panel">
          <p className="auth-eyebrow">User Registration</p>
          <h1>Create your CelebrationHub account</h1>
          <p>
            Join us to create and share beautiful celebration pages for your
            special moments.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSignup}>
          <div className="auth-copy">
            <p className="auth-eyebrow">Sign Up</p>
            <h2>Create your account</h2>
          </div>

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {error ? <p className="form-message error">{error}</p> : null}
          {message ? <p className="form-message success">{message}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
```

**File: `frontend/src/App.css`**

```css
:root {
  --bg: linear-gradient(135deg, #f6efe3 0%, #e3eef7 100%);
  --panel: rgba(255, 255, 255, 0.92);
  --panel-strong: #ffffff;
  --text: #18324a;
  --muted: #61768d;
  --accent: #6c5ce7;
  --accent-dark: #5849c7;
  --accent-soft: #f0eeff;
  --border: #d4deea;
  --danger: #be3d3d;
  --danger-soft: #fff1f1;
  --success: #1d7d47;
  --success-soft: #effaf2;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text);
  background: var(--bg);
}

a {
  color: var(--accent);
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  background: var(--panel-strong);
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid rgba(108, 92, 231, 0.16);
  border-color: var(--accent);
}

button,
.button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 18px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}

button:hover,
.button-link:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
}
```

### OUTPUT
**Note:** Take a screenshot showing:
- Signup page with styled form
- Form validation error messages
- Success message after registration
- Browser console showing no errors

---

## Experiment 9: Develop and validate the CelebrationHub user registration form

### AIM
Develop and validate the CelebrationHub user registration form for users and admins.

### Description
This experiment focuses on form validation in a registration system. The CelebrationHub signup and admin signup pages check required fields, password rules, and input matching. The backend also validates data to prevent invalid or duplicate registration requests. It demonstrates both client-side and server-side validation for reliable data entry.

### Source Code

**File: `frontend/src/pages/Signup.js`** (validation logic)

```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");

  const { name, email, password, confirmPassword } = formData;

  // Client-side validation
  if (!name || !email || !password || !confirmPassword) {
    setError("Please fill in all required fields.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);
    await API.post("/auth/register", { name, email, password });
    setMessage("Account created successfully. You can log in now.");
    setTimeout(() => navigate("/"), 700);
  } catch (err) {
    setError(err.response?.data?.message || "Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

**File: `frontend/src/pages/AdminSignup.js`**

```javascript
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminSecret: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { name, email, password, confirmPassword, adminSecret } = formData;

    if (!name || !email || !password || !confirmPassword || !adminSecret) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register-admin", {
        name,
        email,
        password,
        adminSecret
      });
      setMessage("Admin account created successfully. You can log in now.");
      setTimeout(() => navigate("/admin/login"), 700);
    } catch (err) {
      setError(
        err.response?.data?.message || "Admin signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="hero-panel">
          <p className="auth-eyebrow">Admin Registration</p>
          <h1>Create an admin account</h1>
          <p>Manage celebrations and moderate content across the platform.</p>
        </div>

        <form className="auth-card" onSubmit={handleSignup}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <input
            name="adminSecret"
            type="password"
            placeholder="Admin Secret Key"
            value={formData.adminSecret}
            onChange={handleChange}
          />

          {error ? <p className="form-message error">{error}</p> : null}
          {message ? <p className="form-message success">{message}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up as Admin"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/admin/login">Admin Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;
```

**File: `backend/controllers/authController.js`** (server-side validation)

```javascript
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({
        message: "Name, email, password, and admin secret are required"
      });
    }

    if (adminSecret !== (process.env.ADMIN_SECRET || "CELEBRATION_ADMIN_2026")) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }

    const result = await createUser({ name, email, password, role: "admin" });

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message
      });
    }

    res.status(201).json({
      message: "Admin account created successfully",
      user: sanitizeUser(result.user)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;

    if (!email || !role || !newPassword) {
      return res.status(400).json({
        message: "Email, role, and new password are required"
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, role });

    if (!user) {
      return res.status(404).json({ message: "User not found for this role" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message: "Password reset successful. Please login with your new password."
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

### OUTPUT
**Note:** Take a screenshot showing:
- Form validation errors (empty fields, password mismatch, short password)
- Successful registration message
- Backend validation error (duplicate email)
- Admin signup with secret key validation

---

## Experiment 10: Fetch and display CelebrationHub JSON data from the backend using frontend service calls

### AIM
Fetch and display CelebrationHub JSON data from the backend using frontend service calls.

### Description
This experiment shows how a frontend application fetches JSON data from a server. In CelebrationHub, React components use Axios services to request dashboard and celebration data from backend APIs. The received JSON response is processed and displayed in the user interface. It explains how frontend and backend communicate to build a data-driven application.

### Source Code

**File: `frontend/src/services/api.js`**

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

**File: `frontend/src/pages/Dashboard.js`**

```javascript
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { clearSession, getStoredUser } from "../services/auth";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    birthday: 0,
    anniversary: 0,
    achievement: 0,
    users: 0
  });

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadStats = async () => {
      try {
        if (user.role === "admin") {
          const [celebrationsRes, usersRes] = await Promise.all([
            API.get("/celebrations"),
            API.get("/users")
          ]);

          const celebrations = celebrationsRes.data;

          setStats({
            total: celebrations.length,
            birthday: celebrations.filter((c) => c.occasion === "Birthday").length,
            anniversary: celebrations.filter((c) => c.occasion === "Anniversary")
              .length,
            achievement: celebrations.filter((c) => c.occasion === "Achievement")
              .length,
            users: usersRes.data.length
          });
          return;
        }

        const celebrationsRes = await API.get("/celebrations/mine");
        const celebrations = celebrationsRes.data;

        setStats({
          total: celebrations.length,
          birthday: celebrations.filter((c) => c.occasion === "Birthday").length,
          anniversary: celebrations.filter((c) => c.occasion === "Anniversary")
            .length,
          achievement: celebrations.filter((c) => c.occasion === "Achievement")
            .length,
          users: 0
        });
      } catch (error) {
        if (error.response?.status === 401) {
          clearSession();
          navigate("/");
        }
      }
    };

    loadStats();
  }, [navigate, user]);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="auth-eyebrow">Dashboard</p>
          <h1>Welcome, {user.name}</h1>
          <p className="dashboard-subtitle">
            {user.role === "admin"
              ? "Manage all celebrations and users from one place."
              : "Create and share celebration pages for your special moments."}
          </p>
        </div>

        <div className="top-actions">
          {user.role === "admin" ? (
            <Link className="button-link" to="/admin/celebrations">
              Manage Celebrations
            </Link>
          ) : (
            <>
              <Link className="button-link" to="/create">
                Create Celebration
              </Link>
              <Link className="button-link secondary-button-link" to="/my-celebrations">
                My Celebrations
              </Link>
            </>
          )}
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="summary-card">
          <span>Birthdays</span>
          <strong>{stats.birthday}</strong>
        </div>
        <div className="summary-card">
          <span>Anniversaries</span>
          <strong>{stats.anniversary}</strong>
        </div>
        <div className="summary-card">
          <span>Achievements</span>
          <strong>{stats.achievement}</strong>
        </div>
        {user.role === "admin" ? (
          <div className="summary-card">
            <span>Users</span>
            <strong>{stats.users}</strong>
          </div>
        ) : null}
      </section>

      <section className="panel-grid">
        <div className="panel-card">
          <h3>Your profile</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>

        <div className="panel-card">
          <h3>{user.role === "admin" ? "Admin actions" : "Next steps"}</h3>
          {user.role === "admin" ? (
            <>
              <p>View and manage all celebration pages created by users.</p>
              <Link className="inline-link" to="/admin/celebrations">
                Open management panel
              </Link>
            </>
          ) : (
            <>
              <p>
                Create a new celebration page or view your existing celebrations.
              </p>
              <Link className="inline-link" to="/create">
                Create celebration
              </Link>
              <Link className="inline-link" to="/my-celebrations">
                View my celebrations
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
```

**File: `frontend/src/pages/MyCelebrations.js`**

```javascript
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getStoredUser } from "../services/auth";
import "../App.css";

function MyCelebrations() {
  const [celebrations, setCelebrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role === "admin") {
      navigate("/");
      return;
    }

    const loadCelebrations = async () => {
      try {
        const res = await API.get("/celebrations/mine");
        setCelebrations(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load celebrations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCelebrations();
  }, [navigate]);

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="auth-eyebrow">My Celebrations</p>
          <h1>Your celebration pages</h1>
          <p className="dashboard-subtitle">
            View and manage all your created celebration pages.
          </p>
        </div>

        <div className="top-actions">
          <Link className="button-link secondary-button-link" to="/dashboard">
            Dashboard
          </Link>
          <Link className="button-link" to="/create">
            Create New
          </Link>
        </div>
      </section>

      {loading ? <div className="panel-card">Loading celebrations...</div> : null}
      {error ? <div className="panel-card error-box">{error}</div> : null}

      {!loading && !error ? (
        <div className="list-grid">
          {celebrations.length === 0 ? (
            <div className="panel-card">No celebrations found yet.</div>
          ) : (
            celebrations.map((celebration) => (
              <div className="panel-card" key={celebration._id}>
                <div className="card-header">
                  <h3>{celebration.title}</h3>
                  <span className="occasion-badge">{celebration.occasion}</span>
                </div>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(celebration.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Message:</strong> {celebration.message}
                </p>
                <p>
                  <strong>Theme:</strong> {celebration.theme}
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default MyCelebrations;
```

### OUTPUT
**Note:** Take a screenshot showing:
- Dashboard with statistics fetched from backend
- My Celebrations page displaying list of celebrations
- Browser Network tab showing API calls and JSON responses
- Console showing no errors

---

## Experiment 11: Develop the CelebrationHub web application to manage user information using Express and React

### AIM
Develop the CelebrationHub web application to manage user information using Express and React.

### Description
This experiment develops a web application for managing user information using Express and a frontend framework. CelebrationHub supports registration, login, dashboard access, and user data retrieval through connected backend and frontend modules. The Express server handles routes and APIs, while React provides the interactive user interface. It demonstrates a complete full-stack application structure.

### Source Code

**File: `backend/server.js`**

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const userRoutes = require("./routes/userRoutes");
const celebrationRoutes = require("./routes/celebrationRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/celebrations", celebrationRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CelebrationHub Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**File: `backend/routes/authRoutes.js`**

```javascript
const express = require("express");
const {
  register,
  registerAdmin,
  login,
  resetPassword,
  me
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);

module.exports = router;
```

**File: `backend/routes/userRoutes.js`**

```javascript
const express = require("express");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

**File: `frontend/src/pages/Signup.js`** (registration logic)

```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");

  const { name, email, password, confirmPassword } = formData;

  if (!name || !email || !password) {
    setError("Please fill in all required fields.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  await API.post("/auth/register", { name, email, password });
  setMessage("Account created successfully. You can log in now.");
};
```

**File: `frontend/src/pages/Dashboard.js`** (data fetching)

```javascript
const loadStats = async () => {
  try {
    const celebrationsRes = await API.get("/celebrations/mine");
    const celebrations = celebrationsRes.data;

    setStats({
      total: celebrations.length,
      birthday: celebrations.filter((c) => c.occasion === "Birthday").length,
      anniversary: celebrations.filter((c) => c.occasion === "Anniversary")
        .length,
      achievement: celebrations.filter((c) => c.occasion === "Achievement")
        .length
    });
  } catch (error) {
    if (error.response?.status === 401) {
      clearSession();
      navigate("/");
    }
  }
};
```

### OUTPUT
**Note:** Take a screenshot showing:
- Complete user registration flow
- Login and dashboard access
- User list in admin panel
- API routes working in Postman

---

## Experiment 12: Implement a moderation workflow in React for reviewing CelebrationHub pages

### AIM
Implement a moderation workflow in React for reviewing CelebrationHub celebration pages.

### Description
This experiment presents a React-based moderation workflow. In CelebrationHub, admins can review celebration pages and choose to approve or remove them from the management page. Each decision updates the status or visibility of the celebration in the database and interface. It shows how action-based state changes can be implemented in a React application.

### Source Code

**File: `frontend/src/pages/ManageCelebrations.js`**

```javascript
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getStoredUser } from "../services/auth";
import "../App.css";

function ManageCelebrations() {
  const [celebrations, setCelebrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchCelebrations(occasionFilter);
  }, [navigate, occasionFilter]);

  const fetchCelebrations = async (occasion) => {
    try {
      setLoading(true);
      const params = occasion !== "All" ? { occasion } : {};
      const res = await API.get("/celebrations", { params });
      setCelebrations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load celebrations.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (celebrationId) => {
    setError("");
    setMessage("");

    if (!window.confirm("Are you sure you want to delete this celebration?")) {
      return;
    }

    try {
      await API.delete(`/celebrations/${celebrationId}`);
      setMessage("Celebration deleted successfully.");
      fetchCelebrations(occasionFilter);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete celebration.");
    }
  };

  const handleToggleVisibility = async (celebrationId, currentStatus) => {
    setError("");
    setMessage("");

    try {
      await API.patch(`/celebrations/${celebrationId}/visibility`, {
        isPublic: !currentStatus
      });
      setMessage(
        `Celebration ${!currentStatus ? "published" : "hidden"} successfully.`
      );
      fetchCelebrations(occasionFilter);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update visibility.");
    }
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="auth-eyebrow">Admin Panel</p>
          <h1>Manage Celebrations</h1>
          <p className="dashboard-subtitle">
            Review, moderate, and manage all celebration pages.
          </p>
        </div>

        <div className="top-actions">
          <Link className="button-link secondary-button-link" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>

      <section className="filter-section">
        <label>Filter by occasion:</label>
        <select
          value={occasionFilter}
          onChange={(e) => setOccasionFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Birthday">Birthday</option>
          <option value="Anniversary">Anniversary</option>
          <option value="Achievement">Achievement</option>
          <option value="Graduation">Graduation</option>
          <option value="Other">Other</option>
        </select>
      </section>

      {error ? <div className="panel-card error-box">{error}</div> : null}
      {message ? <div className="panel-card success-box">{message}</div> : null}

      {loading ? (
        <div className="panel-card">Loading celebrations...</div>
      ) : (
        <div className="list-grid">
          {celebrations.length === 0 ? (
            <div className="panel-card">No celebrations found.</div>
          ) : (
            celebrations.map((celebration) => (
              <div className="panel-card" key={celebration._id}>
                <div className="card-header">
                  <h3>{celebration.title}</h3>
                  <span className="occasion-badge">{celebration.occasion}</span>
                </div>

                <p>
                  <strong>Created by:</strong> {celebration.createdBy?.name} (
                  {celebration.createdBy?.email})
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(celebration.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Message:</strong> {celebration.message}
                </p>
                <p>
                  <strong>Theme:</strong> {celebration.theme}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {celebration.isPublic ? "Public" : "Hidden"}
                </p>

                <div className="action-row">
                  <button
                    onClick={() =>
                      handleToggleVisibility(
                        celebration._id,
                        celebration.isPublic
                      )
                    }
                  >
                    {celebration.isPublic ? "Hide" : "Publish"}
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => handleDelete(celebration._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ManageCelebrations;
```

**File: `backend/controllers/celebrationController.js`** (admin actions)

```javascript
exports.toggleVisibility = async (req, res) => {
  try {
    const { isPublic } = req.body;

    const celebration = await Celebration.findById(req.params.id);

    if (!celebration) {
      return res.status(404).json({ message: "Celebration not found" });
    }

    celebration.isPublic = isPublic;
    await celebration.save();

    res.json(celebration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCelebration = async (req, res) => {
  try {
    const celebration = await Celebration.findById(req.params.id);

    if (!celebration) {
      return res.status(404).json({ message: "Celebration not found" });
    }

    // Admin can delete any celebration
    if (
      req.user.role !== "admin" &&
      celebration.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await celebration.deleteOne();

    res.json({ message: "Celebration deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

### OUTPUT
**Note:** Take a screenshot showing:
- Admin panel with list of celebrations
- Toggle visibility button changing status
- Delete confirmation dialog
- Success/error messages after actions

---

## Experiment 13: Develop the CelebrationHub celebration management system using React and Node.js

### AIM
Develop the CelebrationHub celebration management system using React and Node.js.

### Description
This experiment develops a celebration management system using React, which represents the core functionality of the CelebrationHub project. Users can create celebration pages for different occasions, view their celebration history, and share them. The backend validates data and stores each celebration in MongoDB. It represents the main objective of the entire project.

### Source Code

**File: `backend/models/Celebration.js`**

```javascript
const mongoose = require("mongoose");

const celebrationSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true, trim: true },
    occasion: {
      type: String,
      enum: ["Birthday", "Anniversary", "Achievement", "Graduation", "Other"],
      required: true
    },
    date: { type: Date, required: true },
    message: { type: String, required: true, minlength: 10, trim: true },
    theme: {
      type: String,
      enum: ["default", "birthday", "anniversary", "achievement", "festive"],
      default: "default"
    },
    images: [{ type: String }],
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Celebration", celebrationSchema);
```

**File: `backend/controllers/celebrationController.js`**

```javascript
exports.createCelebration = async (req, res) => {
  try {
    const { title, occasion, date, message, theme } = req.body;

    if (!title || !occasion || !date || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const celebrationDate = new Date(date);

    if (celebrationDate < new Date()) {
      return res.status(400).json({
        message: "Celebration date cannot be in the past"
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        message: "Message must be at least 10 characters long"
      });
    }

    const celebration = await Celebration.create({
      createdBy: req.user._id,
      title: title.trim(),
      occasion,
      date: celebrationDate,
      message: message.trim(),
      theme: theme || "default"
    });

    res.status(201).json(celebration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

**File: `frontend/src/pages/CreateCelebration.js`**

```javascript
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function CreateCelebration() {
  const [formData, setFormData] = useState({
    title: "",
    occasion: "Birthday",
    date: "",
    message: "",
    theme: "default"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await API.post("/celebrations", {
        title: formData.title,
        occasion: formData.occasion,
        date: formData.date,
        message: formData.message,
        theme: formData.theme
      });

      setMessage("Celebration created successfully.");
      setFormData({
        title: "",
        occasion: "Birthday",
        date: "",
        message: "",
        theme: "default"
      });

      setTimeout(() => navigate("/my-celebrations"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create celebration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="auth-eyebrow">Create Celebration</p>
          <h1>Create a new celebration page</h1>
          <p className="dashboard-subtitle">
            Share your special moments with a personalized celebration page.
          </p>
        </div>

        <div className="top-actions">
          <Link className="button-link secondary-button-link" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>

      <form className="form-panel" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          name="title"
          placeholder="e.g., John's 25th Birthday"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Occasion</label>
        <select
          name="occasion"
          value={formData.occasion}
          onChange={handleChange}
          required
        >
          <option value="Birthday">Birthday</option>
          <option value="Anniversary">Anniversary</option>
          <option value="Achievement">Achievement</option>
          <option value="Graduation">Graduation</option>
          <option value="Other">Other</option>
        </select>

        <label>Date</label>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Message</label>
        <textarea
          name="message"
          rows="5"
          placeholder="Write a heartfelt message..."
          value={formData.message}
          onChange={handleChange}
          required
        />

        <label>Theme</label>
        <select name="theme" value={formData.theme} onChange={handleChange}>
          <option value="default">Default</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
          <option value="achievement">Achievement</option>
          <option value="festive">Festive</option>
        </select>

        {error ? <p className="form-message error">{error}</p> : null}
        {message ? <p className="form-message success">{message}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Celebration"}
        </button>
      </form>
    </div>
  );
}

export default CreateCelebration;
```

**File: `frontend/src/pages/MyCelebrations.js`** (viewing celebrations)

```javascript
useEffect(() => {
  const loadCelebrations = async () => {
    try {
      const res = await API.get("/celebrations/mine");
      setCelebrations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load celebrations.");
    } finally {
      setLoading(false);
    }
  };

  loadCelebrations();
}, [navigate]);

// Display celebrations
celebrations.map((celebration) => (
  <div className="panel-card" key={celebration._id}>
    <div className="card-header">
      <h3>{celebration.title}</h3>
      <span className="occasion-badge">{celebration.occasion}</span>
    </div>
    <p>
      <strong>Date:</strong> {new Date(celebration.date).toLocaleDateString()}
    </p>
    <p>
      <strong>Message:</strong> {celebration.message}
    </p>
    <p>
      <strong>Theme:</strong> {celebration.theme}
    </p>
  </div>
));
```

### OUTPUT
**Note:** Take a screenshot showing:
- Create celebration form with all fields
- Successful creation message
- My Celebrations page showing created celebration
- MongoDB document in celebrations collection

---

## Experiment 14: Build the CelebrationHub React application using reusable components and routing between pages

### AIM
Build the CelebrationHub React application using reusable components and routing between pages.

### Description
This experiment demonstrates the use of React components and routing across multiple web pages. CelebrationHub includes separate pages for login, signup, dashboard, celebration creation, history, and admin management. React Router is used to navigate between pages, and protected routes restrict access to authorized users. It explains how component-based design and routing improve the structure of a multi-page frontend application.

### Source Code

**File: `frontend/src/App.js`**

```javascript
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import CreateCelebration from "./pages/CreateCelebration";
import Dashboard from "./pages/Dashboard";
import MyCelebrations from "./pages/MyCelebrations";
import Login from "./pages/Login";
import ManageCelebrations from "./pages/ManageCelebrations";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import PublicCelebrations from "./pages/PublicCelebrations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/explore" element={<PublicCelebrations />} />

        <Route
          element={<ProtectedRoute allowedRoles={["user", "admin"]} />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/create" element={<CreateCelebration />} />
          <Route path="/my-celebrations" element={<MyCelebrations />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin/celebrations"
            element={<ManageCelebrations />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**File: `frontend/src/components/ProtectedRoute.js`**

```javascript
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../services/auth";

function ProtectedRoute({ allowedRoles }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
```

**File: `frontend/src/services/auth.js`**

```javascript
export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
```

**File: `frontend/src/pages/Login.js`**

```javascript
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { saveSession } from "../services/auth";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      saveSession(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="hero-panel">
          <p className="auth-eyebrow">CelebrationHub</p>
          <h1>Create and share digital celebration pages</h1>
          <p>
            Celebrate birthdays, anniversaries, achievements, and more with
            personalized pages.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-copy">
            <p className="auth-eyebrow">Login</p>
            <h2>Welcome back</h2>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <p className="form-message error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          <p className="auth-switch">
            <Link to="/reset-password">Forgot password?</Link>
          </p>

          <p className="auth-switch">
            Admin? <Link to="/admin/login">Admin login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
```

**File: `frontend/src/pages/PublicCelebrations.js`**

```javascript
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function PublicCelebrations() {
  const [celebrations, setCelebrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCelebrations = async () => {
      try {
        const res = await API.get("/celebrations");
        setCelebrations(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load celebrations.");
      } finally {
        setLoading(false);
      }
    };

    loadCelebrations();
  }, []);

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="auth-eyebrow">Explore</p>
          <h1>Public Celebrations</h1>
          <p className="dashboard-subtitle">
            Browse celebration pages shared by our community.
          </p>
        </div>

        <div className="top-actions">
          <Link className="button-link" to="/">
            Login
          </Link>
          <Link className="button-link secondary-button-link" to="/signup">
            Sign Up
          </Link>
        </div>
      </section>

      {loading ? <div className="panel-card">Loading celebrations...</div> : null}
      {error ? <div className="panel-card error-box">{error}</div> : null}

      {!loading && !error ? (
        <div className="list-grid">
          {celebrations.length === 0 ? (
            <div className="panel-card">No public celebrations yet.</div>
          ) : (
            celebrations.map((celebration) => (
              <div className="panel-card celebration-card" key={celebration._id}>
                <div className="card-header">
                  <h3>{celebration.title}</h3>
                  <span className="occasion-badge">{celebration.occasion}</span>
                </div>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(celebration.date).toLocaleDateString()}
                </p>
                <p className="celebration-message">{celebration.message}</p>
                <p className="celebration-author">
                  By {celebration.createdBy?.name}
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default PublicCelebrations;
```

**File: `backend/middleware/authMiddleware.js`**

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
```

### OUTPUT
**Note:** Take a screenshot showing:
- Login page with navigation to signup
- Protected dashboard accessible only after login
- Admin panel accessible only to admin users
- Public celebrations page accessible without login
- Browser showing different routes in URL bar
- React DevTools showing component hierarchy

---

## Summary

This document contains 14 experiments covering the complete full-stack development of **CelebrationHub** using the MERN stack:

1. **Backend Setup** - Node.js and Express server initialization
2. **Authentication** - JWT-based login system
3. **Data Operations** - Seed and reset scripts for MongoDB
4. **HTTP Handling** - Request/response cycle for celebration APIs
5. **Database Connection** - MongoDB integration with Mongoose schemas
6. **CRUD Operations** - Complete data lifecycle management
7. **MongoDB Queries** - Count and sort operations
8. **Frontend Forms** - Styled React forms with event handling
9. **Form Validation** - Client and server-side validation
10. **API Integration** - Fetching and displaying JSON data
11. **Full-Stack Integration** - Express and React working together
12. **Admin Workflow** - Moderation and management features
13. **Core Functionality** - Celebration creation and management
14. **Routing & Components** - React Router and protected routes

### Technologies Used
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Frontend:** React, React Router, Axios
- **Tools:** Postman, MongoDB Compass

### Project Structure
```
CelebrationHub/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── seed.js
│   └── resetData.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.js
    │   └── App.css
    └── package.json
```

---

**End of Document**
