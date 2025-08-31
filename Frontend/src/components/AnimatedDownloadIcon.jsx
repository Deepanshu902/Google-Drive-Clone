// src/components/AnimatedDownloadIcon.jsx
import { motion, useAnimation } from "motion/react";

const AnimatedDownloadIcon = ({
  width = 24, // Adjusted default size to match other icons
  height = 24,
  strokeWidth = 1.5, // Adjusted to match other icons
  stroke = "currentColor", // Use currentColor to inherit color
  ...props
}) => {
  const controls = useAnimation();

  return (
    // The wrapping div was removed and events are now on the button
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.path
        variants={{
          normal: { pathLength: 1, opacity: 1 },
          animate: { pathLength: 1, opacity: 1 },
        }}
        animate={controls}
        initial="normal"
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      />
      <motion.g
        variants={{
          normal: { y: 0 },
          animate: { y: [0, 2, 0], transition: { repeat: Infinity, duration: 1.5 } }, // Adjusted animation
        }}
        animate={controls}
        initial="normal"
      >
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </motion.g>
    </svg>
  );
};

export default AnimatedDownloadIcon;