// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Hero Section */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-center text-gray-200"
      >
        Welcome to <span className="text-blue-500">Cloud Drive</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="mt-4 text-lg md:text-xl text-center max-w-2xl text-gray-400"
      >
        Your secure and private cloud storage. Store, manage, and share files effortlessly.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-8 flex space-x-4"
      >
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold transition hover:bg-blue-500"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border-2 border-gray-500 px-6 py-3 rounded-lg text-lg font-bold transition hover:bg-gray-800"
        >
          Login
        </Link>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center px-4"
      >
        {[
          { title: "🔒 Secure Storage", desc: "Your data is encrypted and protected at all times." },
          { title: "⚡ Easy Sharing", desc: "Share files with anyone instantly with a simple link." },
          { title: "🛡️ Privacy First", desc: "We never access your files. Your privacy matters." },
          { title: "💾 Ample Storage", desc: "Get generous free storage with upgrade options." },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 + index * 0.2 }}
            className="bg-gray-900 text-gray-300 p-6 rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Cloud Icons */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png"
        alt="Cloud Icon"
        className="absolute top-16 left-10 w-16 opacity-20"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1160/1160371.png"
        alt="Cloud Icon"
        className="absolute top-24 right-10 w-20 opacity-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1160/1160377.png"
        alt="Cloud Icon"
        className="absolute bottom-16 left-24 w-24 opacity-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="w-full bg-gray-900 text-gray-400 text-center py-6 mt-16"
      >
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Cloud Drive. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-3">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
