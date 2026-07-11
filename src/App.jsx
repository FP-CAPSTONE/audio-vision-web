import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import MobileMockup from './components/MobileMockup';
import { useVideoSimulation } from './hooks/useVideoSimulation';

export default function App() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [initialIsMuted] = useState(() => typeof window !== 'undefined' ? window.self !== window.top : true);
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  
  const videoSectionRef = useRef(null);
  const iframeRef = useRef(null);
  const isVideoInView = useInView(videoSectionRef, { margin: "-100px" });

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isVideoInView) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  }, [isVideoInView]);

  const toggleMute = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: isMuted ? 'unMute' : 'mute',
        args: []
      }), '*');
      iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsMuted(!isMuted);
    }
  };

  const isAutoScroll = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('autoScroll') === 'true' : false;
  const { zoomLevel: simulationZoom } = useVideoSimulation(isAutoScroll, videoSectionRef, toggleMute);
  
  const finalZoomLevel = isAutoScroll ? simulationZoom : (isVideoInView ? 1.15 : 1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effects for Hero
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const yImage = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  // Reusable animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const slideUpImage = {
    hidden: { opacity: 0, y: 80 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] overflow-x-hidden font-sans selection:bg-[#1d1d1f] selection:text-white pb-24">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${isScrolled ? 'glass-panel' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center cursor-pointer">
            <img src={import.meta.env.BASE_URL + "assets/remove-bg-logo.png"} alt="Audio Vision Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Audio Vision
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-40 px-6 flex flex-col justify-center items-center text-center origin-top">
        <motion.div
          style={{ opacity, scale }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none">
            Vision.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-400">Reimagined.</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-3xl font-medium text-[#86868b] max-w-2xl mx-auto tracking-tight pt-4 px-4">
            A revolutionary platform built to assist the visually impaired. Navigate your world with confidence.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          style={{ y: yImage }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-5xl mx-auto z-10"
        >
          <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/welcome-onboarding-introduction screen.webp"} className="md:!max-w-[340px]" />
        </motion.div>
      </section>

      {/* Cinematic Video Section */}
      <motion.section 
        ref={videoSectionRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-6 max-w-6xl mx-auto mb-32"
      >
        <motion.div 
          animate={{ scale: finalZoomLevel }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#e5e5ea] bg-black aspect-video relative group"
        >
          
          <iframe 
            ref={iframeRef}
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/LbnpmXXnE_E?mute=${initialIsMuted ? 1 : 0}&controls=0&rel=0&modestbranding=1&loop=1&playlist=LbnpmXXnE_E&cc_load_policy=0&enablejsapi=1`} 
            title="Audio Vision App" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            className="absolute inset-0 w-full h-full scale-[1.03] pointer-events-none"
          ></iframe>

          {/* Custom UI Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 cursor-pointer" onClick={toggleMute}>
            <button 
              className="bg-white/80 backdrop-blur-md text-black p-5 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center pointer-events-none"
            >
              {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </button>
            <span className="text-white font-medium mt-4 tracking-tight shadow-sm drop-shadow-md bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              {isMuted ? "Click anywhere to unmute" : "Click anywhere to mute"}
            </span>
          </div>

        </motion.div>
      </motion.section>

      {/* Bento Grid Section */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-[#1d1d1f]">Innovation for everyone.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1 - Large */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="bento-card col-span-1 md:col-span-2 lg:col-span-2 p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group min-h-[500px]"
          >
              <motion.div variants={fadeUp} className="z-10 flex-1 space-y-6 text-center md:text-left">
                 <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight">Real-time object detection.</h3>
                 <p className="text-xl text-[#86868b] max-w-md mx-auto md:mx-0">Understand your surroundings instantly. Our advanced AI scans your environment and provides clear auditory feedback.</p>
              </motion.div>
              <motion.div variants={slideUpImage} className="flex-1 w-full flex justify-center translate-y-4 md:translate-y-12 group-hover:translate-y-2 md:group-hover:translate-y-8 transition-transform duration-700 ease-out">
                 <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/feat-realtime-object-detection.webp"} className="max-w-[220px] md:max-w-[290px]" />
              </motion.div>
          </motion.div>

          {/* Bento Card 2 - Tall */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="bento-card col-span-1 p-10 flex flex-col justify-between items-center text-center gap-8 group min-h-[500px]"
          >
              <motion.div variants={fadeUp} className="space-y-4 z-10">
                 <h3 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Route Guidance.</h3>
                 <p className="text-[#86868b] text-lg">Turn-by-turn auditory directions.</p>
              </motion.div>
              <motion.div variants={slideUpImage} className="w-full flex justify-center translate-y-2 md:translate-y-6 group-hover:translate-y-0 md:group-hover:translate-y-2 transition-transform duration-700 ease-out">
                 <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/feat-route-guidance.jpg"} className="max-w-[200px] md:max-w-[260px] origin-top" />
              </motion.div>
          </motion.div>
          
          {/* Bento Card 3 */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="bento-card col-span-1 p-10 flex flex-col justify-between items-center text-center gap-8 group min-h-[500px]"
          >
              <motion.div variants={fadeUp} className="space-y-4 z-10">
                 <h3 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Haptic Feedback.</h3>
                 <p className="text-[#86868b] text-lg">Multi-sensory vibrations.</p>
              </motion.div>
              <motion.div variants={slideUpImage} className="w-full flex justify-center translate-y-4 md:translate-y-12 group-hover:translate-y-2 md:group-hover:translate-y-8 transition-transform duration-700 ease-out">
                 <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/feat-audio-vibrations-feedbacl.webp"} className="max-w-[200px] md:max-w-[260px] origin-top" />
              </motion.div>
          </motion.div>

          {/* Bento Card 4 - Wide */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="bento-card col-span-1 md:col-span-2 p-10 flex flex-col md:flex-row items-center gap-8 group min-h-[500px] overflow-hidden"
          >
              <motion.div variants={slideUpImage} className="flex-1 w-full flex justify-center translate-y-4 md:translate-y-12 group-hover:translate-y-2 md:group-hover:translate-y-8 transition-transform duration-700 ease-out">
                 <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/feat-auto-command-multi-language-support.jpg"} className="max-w-[200px] md:max-w-[260px] origin-top" />
              </motion.div>
              <motion.div variants={fadeUp} className="flex-1 space-y-6 z-10 text-center md:text-left">
                 <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight">Multi-language support.</h3>
                 <p className="text-[#86868b] text-xl">Speak your language naturally. Audio Vision understands you globally with automated voice commands.</p>
              </motion.div>
          </motion.div>

          {/* Bento Card 5 - Share Location */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="bento-card col-span-1 md:col-span-2 lg:col-span-2 p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group min-h-[500px]"
          >
              <motion.div variants={fadeUp} className="z-10 flex-1 space-y-6 text-center md:text-left">
                 <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight">Share your journey.</h3>
                 <p className="text-xl text-[#86868b] max-w-md mx-auto md:mx-0">Easily share your real-time location with friends and family for added safety and peace of mind.</p>
              </motion.div>
              <motion.div variants={slideUpImage} className="flex-1 w-full flex justify-center translate-y-4 md:translate-y-12 group-hover:translate-y-2 md:group-hover:translate-y-8 transition-transform duration-700 ease-out">
                 <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/feat-share-location.jpg"} className="max-w-[220px] md:max-w-[290px]" />
              </motion.div>
          </motion.div>

          {/* Bento Card 6 - Location Tracking */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="bento-card col-span-1 p-10 flex flex-col justify-between items-center text-center gap-8 group min-h-[500px]"
          >
              <motion.div variants={fadeUp} className="space-y-4 z-10">
                 <h3 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Location Tracking.</h3>
                 <p className="text-[#86868b] text-lg">Know exactly where you are.</p>
              </motion.div>
              <motion.div variants={slideUpImage} className="w-full flex justify-center translate-y-2 md:translate-y-6 group-hover:translate-y-0 md:group-hover:translate-y-2 transition-transform duration-700 ease-out">
                 <MobileMockup imageSrc={import.meta.env.BASE_URL + "assets/feat-location-tracking.jpg"} className="max-w-[200px] md:max-w-[260px] origin-top" />
              </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Footer CTA */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-32 pt-20 pb-10 px-6 border-t border-[#e5e5ea]"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Experience independence.</h2>
          <p className="text-lg sm:text-xl text-[#86868b]">Audio Vision brings the world closer to you.</p>
        </div>
      </motion.section>
    </div>
  );
}
