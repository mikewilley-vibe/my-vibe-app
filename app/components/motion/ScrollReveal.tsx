"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  threshold?: number;
};

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: `0px 0px -${(1 - threshold) * 100}% 0px` });

  const directionVariants = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction].initial}
      animate={isInView ? directionVariants[direction].animate : directionVariants[direction].initial}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
