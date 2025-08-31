// src/components/AnimatedDeleteIcon.jsx
import { motion } from "motion/react";

const lidVariants = {
  normal: { y: 0 },
  animate: { y: -1.1 },
};

const springTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

const AnimatedDeleteIcon = ({
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  stroke = "currentColor",
  animate, // Accept animation controls as a prop
  ...props
}) => {
  return (
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
      <motion.g
        variants={lidVariants}
        animate={animate}
        transition={springTransition}
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      <motion.path
        d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"
        variants={{
          normal: { d: "M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8" },
          animate: { d: "M19 9v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V9" },
        }}
        animate={animate}
        transition={springTransition}
      />
      <motion.line
        x1="10"
        x2="10"
        y1="11"
        y2="17"
        variants={{
          normal: { y1: 11, y2: 17 },
          animate: { y1: 11.5, y2: 17.5 },
        }}
        animate={animate}
        transition={springTransition}
      />
      <motion.line
        x1="14"
        x2="14"
        y1="11"
        y2="17"
        variants={{
          normal: { y1: 11, y2: 17 },
          animate: { y1: 11.5, y2: 17.5 },
        }}
        animate={animate}
        transition={springTransition}
      />
    </svg>
  );
};

export default AnimatedDeleteIcon;