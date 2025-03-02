import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  Dashboard,
  LandingPage,
  Login,
  Register
} from "./pages/index"
import Navbar from "./components/Navbar"

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;