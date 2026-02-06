"use client";

import { motion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
};

export default function FadeIn({ children, delay = 0, duration = 0.6 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // cubic-bezier for premium feel
      }}
    >
      {children}
    </motion.div>
  );
}