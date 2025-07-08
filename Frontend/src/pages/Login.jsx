import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../services/authService";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await loginUser(formData);
      // Fix: dispatch the user data, not the entire response
      dispatch(login(response.data));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Login to Cloud Drive</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;