import React from 'react';
import { motion } from "framer-motion"; 

const Button = ({ children, variant = "default", className = "", ...props }) => {
  let baseStyle = "font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50";

  switch (variant) {
    case "outline":
      baseStyle += " px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-200";
      break;
    case "ghost":
      baseStyle += " px-6 py-3 rounded-xl text-blue-600 hover:text-blue-700 bg-transparent shadow-none";
      break;
    case "red-outline": 
      baseStyle += " px-6 py-3 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-200";
      break;
    case "purple-outline": 
      baseStyle += " px-6 py-3 rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-200";
      break;
    default:
      baseStyle += " px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md focus:ring-blue-400";
      break;
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;