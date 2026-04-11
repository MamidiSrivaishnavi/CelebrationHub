import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCelebration from "./pages/CreateCelebration";
import EditCelebration from "./pages/EditCelebration";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;