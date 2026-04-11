import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCelebration from "./pages/CreateCelebration";
import EditCelebration from "./pages/EditCelebration";
import CelebrationView from "./pages/CelebrationView";
import AllCelebrations from "./pages/AllCelebrations";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateCelebration />} />
          <Route path="/edit/:id" element={<EditCelebration />} />
          <Route path="/celebration/:id" element={<CelebrationView />} />
          <Route path="/celebrations" element={<AllCelebrations />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;