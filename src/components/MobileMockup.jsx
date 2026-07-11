import React from 'react';
import { motion } from 'framer-motion';

export default function MobileMockup({ imageSrc, altText, className = '' }) {
  return (
    <div className={`relative mx-auto border-black bg-black border-[14px] rounded-[3rem] h-[600px] w-[290px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ${className}`}>
      {/* Notch */}
      <div className="w-[120px] h-[25px] bg-black top-0 rounded-b-[1.2rem] left-1/2 -translate-x-1/2 absolute z-20 shadow-inner flex justify-center items-center">
         <div className="w-12 h-1.5 rounded-full bg-gray-800"></div>
      </div>
      {/* Buttons */}
      <div className="h-[46px] w-[3px] bg-[#1c1c1e] absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-[#1c1c1e] absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-[#1c1c1e] absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      {/* Screen */}
      <div className="rounded-[2.2rem] overflow-hidden w-full h-full bg-black relative">
        <img src={imageSrc} className="w-full h-full object-cover object-top" alt={altText} />
      </div>
    </div>
  );
}
