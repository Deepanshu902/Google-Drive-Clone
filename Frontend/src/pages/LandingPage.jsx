import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white antialiased">
      
      {/* Apple-Style Navigation - Ultra Minimal */}

<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
  <div className="max-w-[980px] mx-auto px-6 py-3 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
      </motion.div>
      <span className="text-[17px] font-semibold text-black -tracking-[0.022em]">
        Cloud Drive
      </span>
    </div>
    <div className="flex items-center gap-8">
      <Link 
        to="/login" 
        className="text-[14px] font-normal text-black/80 hover:text-black transition-colors"
      >
        Sign in
      </Link>
      <Link
        to="/signup"
        className="text-[14px] font-normal text-blue-600 hover:text-blue-700 transition-colors"
      >
        Get started
      </Link>
    </div>
  </div>
</nav>

      {/* Hero Section - Apple-style spacing and typography */}
      <section className="pt-[120px] pb-[80px] px-6 relative overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-[980px] mx-auto text-center"
        >
          
          {/* Pre-headline - Small, subtle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[17px] font-semibold text-black/60 mb-2 tracking-tight"
          >
            Cloud Drive
          </motion.p>

          {/* Main Headline - Large, bold, Apple-style */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[56px] md:text-[80px] leading-[1.05] font-semibold text-black mb-4 -tracking-[0.015em]"
          >
            Store everything.
            <br />
            Access anywhere.
          </motion.h1>

          {/* Subheadline - Medium weight, readable */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[21px] md:text-[24px] leading-[1.381] font-normal text-black/80 mb-6 max-w-[640px] mx-auto"
          >
            The most seamless way to keep your files safe and in sync on the web.
          </motion.p>

          {/* CTA Buttons - Apple blue and minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-3"
          >
            <Link
              to="/signup"
              className="px-[22px] py-[12px] bg-blue-600 text-white rounded-full text-[17px] font-normal hover:bg-blue-700 transition-all leading-[1.23536]"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="text-[17px] font-normal text-blue-600 hover:text-blue-700 transition-colors leading-[1.23536]"
            >
              Learn more →
            </Link>
          </motion.div>

          {/* Fine print - Very subtle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[12px] font-normal text-black/50 mt-2"
          >
            Get 10 GB of storage free. No credit card required.
          </motion.p>
        </motion.div>
      </section>

      {/* Feature Section 1 - Image + Text (Apple style) */}
      <section className="py-[100px] px-6 bg-black text-white">
        <div className="max-w-[980px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-[48px] md:text-[64px] leading-[1.0625] font-semibold mb-6 -tracking-[0.009em]">
              Blazing fast.
              <br />
              Built for the web.
            </h2>
            <p className="text-[21px] md:text-[24px] leading-[1.381] font-normal text-white/80 max-w-[640px] mx-auto">
              Your files sync instantly through your browser with industry-standard security.
            </p>
          </motion.div>

          {/* Three column features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                title: "Lightning sync",
                desc: "Upload and access files in milliseconds powered by Cloudinary.",
              },
              {
                title: "Secure storage",
                desc: "Industry-standard cloud security keeps your files protected.",
              },
              {
                title: "Web-based",
                desc: "Works seamlessly in any modern browser. No downloads needed.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-left"
              >
                <h3 className="text-[24px] font-semibold mb-2 -tracking-[0.009em]">
                  {feature.title}
                </h3>
                <p className="text-[17px] leading-[1.47059] font-normal text-white/70">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Split layout */}
      <section className="py-[100px] px-6">
        <div className="max-w-[980px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[40px] md:text-[48px] leading-[1.0834933333] font-semibold text-black mb-4 -tracking-[0.003em]">
              Share with anyone.
              <br />
              Control everything.
            </h2>
            <p className="text-[17px] leading-[1.47059] font-normal text-black/80 mb-6">
              Generate secure sharing links with custom permissions. Set expiration dates and password protection with a single click.
            </p>
            <Link
              to="/signup"
              className="inline-block text-[17px] font-normal text-blue-600 hover:text-blue-700 transition-colors"
            >
              Get started →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-12 aspect-square flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🔗</div>
              <div className="space-y-2">
                <div className="h-2 w-32 bg-black/10 rounded mx-auto" />
                <div className="h-2 w-24 bg-black/10 rounded mx-auto" />
                <div className="h-2 w-28 bg-black/10 rounded mx-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 3 - Reverse split */}
      <section className="py-[100px] px-6 bg-slate-50">
        <div className="max-w-[980px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-slate-100 rounded-3xl p-12 aspect-square flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💾</div>
              <div className="text-[48px] font-semibold text-black">10 GB</div>
              <div className="text-[17px] text-black/60 mt-2">Free storage</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-[40px] md:text-[48px] leading-[1.0834933333] font-semibold text-black mb-4 -tracking-[0.003em]">
              Start with 10 GB.
              <br />
              Scale as you grow.
            </h2>
            <p className="text-[17px] leading-[1.47059] font-normal text-black/80 mb-6">
              Every account starts with generous free storage. Upgrade anytime for more space, with flexible plans that fit your needs.
            </p>
            <Link
              to="/signup"
              className="inline-block text-[17px] font-normal text-blue-600 hover:text-blue-700 transition-colors"
            >
              See plans →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Apple minimalist style */}
      <section className="py-[100px] px-6">
        <div className="max-w-[980px] mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: "10 GB", label: "Free storage" },
              { number: "Fast", label: "Upload speed" },
              { number: "Secure", label: "Cloud storage" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="text-[56px] md:text-[64px] leading-[1.0625] font-semibold text-black -tracking-[0.009em]">
                  {stat.number}
                </div>
                <div className="text-[17px] leading-[1.47059] font-normal text-black/60 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Apple style */}
      <section className="py-[120px] px-6 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[640px] mx-auto text-center"
        >
          <h2 className="text-[48px] md:text-[64px] leading-[1.0625] font-semibold text-black mb-6 -tracking-[0.009em]">
            Get started today.
          </h2>
          <p className="text-[21px] leading-[1.381] font-normal text-black/80 mb-8">
            Join thousands of people who trust Cloud Drive with their most important files.
          </p>
          <Link
            to="/signup"
            className="inline-block px-[22px] py-[12px] bg-blue-600 text-white rounded-full text-[17px] font-normal hover:bg-blue-700 transition-all"
          >
            Start free trial
          </Link>
          <p className="text-[12px] font-normal text-black/50 mt-3">
            10 GB free • No credit card required
          </p>
        </motion.div>
      </section>

      {/* Footer - Apple minimal */}
      <footer className="py-[17px] px-6 border-t border-black/10">
        <div className="max-w-[980px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[12px] font-normal text-black/60">
            Copyright © 2024 Cloud Drive Inc. All rights reserved.
          </p>
          <div className="flex gap-5 text-[12px] font-normal text-black/60">
            <Link to="/privacy" className="hover:text-black/80 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black/80 transition-colors">Terms of Use</Link>
            <Link to="/contact" className="hover:text-black/80 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;