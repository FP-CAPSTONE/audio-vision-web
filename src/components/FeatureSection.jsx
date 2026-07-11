import React from 'react';
import { motion } from 'framer-motion';
import MobileMockup from './MobileMockup';

export default function FeatureSection({ title, description, imageSrc, reversed = false }) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className={`max-w-6xl mx-auto flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
        
        <motion.div 
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: reversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {title}
          </h3>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="flex-1 flex justify-center w-full">
          <MobileMockup imageSrc={imageSrc} altText={title} />
        </div>
      </div>
    </section>
  );
}
