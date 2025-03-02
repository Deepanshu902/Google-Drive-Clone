import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  Dashboard,
  LandingPage,
  Login,
  SignupPage
} from "./pages/index"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;