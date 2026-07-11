import React from 'react';
import { motion } from 'framer-motion';

export default function MobileMockup({ imageSrc, altText, className = '' }) {
  return (
    <div className={`relative mx-auto border-black bg-black border-[12px] sm:border-[14px] rounded-[2.5rem] sm:rounded-[3rem] w-full max-w-[290px] aspect-[290/600] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex-shrink-0 ${className}`}>
      {/* Notch */}
      <div className="w-[40%] h-[20px] sm:h-[25px] bg-black top-0 rounded-b-[1rem] sm:rounded-b-[1.2rem] left-1/2 -translate-x-1/2 absolute z-20 shadow-inner flex justify-center items-center">
         <div className="w-8 sm:w-12 h-1 sm:h-1.5 rounded-full bg-gray-800"></div>
      </div>
      {/* Buttons */}
      <div className="h-[8%] w-[3px] bg-[#1c1c1e] absolute -left-[14px] sm:-left-[17px] top-[20%] rounded-l-lg"></div>
      <div className="h-[8%] w-[3px] bg-[#1c1c1e] absolute -left-[14px] sm:-left-[17px] top-[29%] rounded-l-lg"></div>
      <div className="h-[10%] w-[3px] bg-[#1c1c1e] absolute -right-[14px] sm:-right-[17px] top-[23%] rounded-r-lg"></div>
      {/* Screen */}
      <div className="rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden w-full h-full bg-black relative">
        <img src={imageSrc} className="w-full h-full object-cover object-top" alt={altText} />
      </div>
    </div>
  );
}
