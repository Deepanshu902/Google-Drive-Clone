import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/authService";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const response = await registerUser(formData);
      dispatch(login(response.data));
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-6 py-12 antialiased">
      
      {/* Back to Home Link */}
      <Link 
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-[14px] text-black/60 hover:text-black transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20"
          >
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
          </motion.div>
          
          <h1 className="text-[32px] font-semibold text-black mb-2 -tracking-[0.015em]">
            Create your account
          </h1>
          <p className="text-[14px] text-black/60">
            Get started with 10 GB free storage
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8">
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-[14px] text-red-700"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            
            {/* Name Field */}
            <div>
              <label className="block text-[14px] font-medium text-black/80 mb-2">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[14px] font-medium text-black/80 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                pattern="^[a-zA-Z0-9._%+\-]+@gmail.com$"
                title="Only Gmail addresses allowed"
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="you@gmail.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[14px] font-medium text-black/80 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-[15px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-[12px] text-black/50 text-center mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-[14px] text-black/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;