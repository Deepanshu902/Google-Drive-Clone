import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  Dashboard,
  LandingPage,
  Login,
  SignupPage,
  SharedWithMe
} from "./pages/index"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/shared-with-me" element={<SharedWithMe/>}/>
      </Routes>
    </Router>
  );
}

export default App;