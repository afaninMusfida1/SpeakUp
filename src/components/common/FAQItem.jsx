import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion"; 
import { fadeInUp } from '../../lib/landingPageUtils'; 

const FAQItem = ({ question, answer, icon: Icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <motion.div 
      variants={fadeInUp} 
      className={`border rounded-xl shadow-md overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-400 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white px-6 py-4 font-semibold flex justify-between items-center transition-all duration-300"
      >
        <span className="flex items-center text-lg text-gray-900">
          {Icon && <Icon className={`w-5 h-5 mr-3 transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-500'}`} />} 
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`} style={{ transitionProperty: 'max-height' }}>
        <div className="px-6 pb-4 pt-0 text-gray-600 border-t border-gray-100">
          {answer}
        </div>
      </div>
    </motion.div>
  );
};

export default FAQItem;