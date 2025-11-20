import React, { useState, useEffect } from "react";
import { ARTICLE_PLACEHOLDER_URL, GENERIC_FALLBACK_URL } from '../../lib/landingPageUtils'; 

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src); 
  }, [src]);

  return (
    <img
      src={imgSrc || GENERIC_FALLBACK_URL} 
      alt={alt}
      className={className}
      onError={() => setImgSrc(ARTICLE_PLACEHOLDER_URL)} 
      loading="lazy"
    />
  );
};

export default ImageWithFallback;