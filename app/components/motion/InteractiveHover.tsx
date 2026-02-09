"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type InteractiveHoverProps = {
  children: React.ReactNode;
  scaleOnHover?: number;
  rotateOnHover?: number;
  shadowOnHover?: boolean;
};

export default function InteractiveHover({
  children,
  scaleOnHover = 1.02,
  rotateOnHover = 0,
  shadowOnHover = true,
}: InteractiveHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      animate={isHovered ? { scale: scaleOnHover, rotate: rotateOnHover } : { scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={shadowOnHover ? "transition-shadow duration-300" : ""}
      style={shadowOnHover && isHovered ? { boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)" } : {}}
    >
      {children}
    </motion.div>
  );
}
