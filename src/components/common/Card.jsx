import React from 'react';

const Card = ({ children, className = "", onClick }) => (
  <div 
    className={`bg-white rounded-2xl shadow-lg ${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default Card;