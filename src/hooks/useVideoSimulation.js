import { useEffect, useState, useRef } from 'react';

export const useVideoSimulation = (isAutoScroll, videoSectionRef, toggleMute) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [simulationDone, setSimulationDone] = useState(false);
  
  const toggleMuteRef = useRef(toggleMute);
  useEffect(() => { toggleMuteRef.current = toggleMute; }, [toggleMute]);

  useEffect(() => {
    if (!isAutoScroll) return;

    let scrollFrame;
    let isScrolling = true;
    let delayTimeout;
    let sequenceTimeouts = [];
    
    const startScroll = () => {
      const docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
      const winHeight = window.innerHeight;
      
      if (!simulationDone && videoSectionRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const videoCenterY = rect.top + rect.height / 2;
        const viewportCenterY = winHeight / 2;
        
        // Stop scrolling when video center is within 15px of viewport center
        if (Math.abs(videoCenterY - viewportCenterY) < 15) {
          isScrolling = false;
          runSequence();
          return;
        }
      }

      if (window.scrollY + winHeight >= docHeight - 10) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Reset smoothly
        isScrolling = false;
        setSimulationDone(false); // Reset simulation for next loop
        delayTimeout = setTimeout(() => { isScrolling = true; startScroll(); }, 2500);
        return;
      } else if (isScrolling) {
        const speed = window.innerWidth < 768 ? 2.5 : 4;
        window.scrollBy(0, speed);
      }
      scrollFrame = requestAnimationFrame(startScroll);
    };

    const runSequence = () => {
      // 1. Zoom in significantly
      setZoomLevel(1.15);

      // 2. Zoom out
      sequenceTimeouts.push(setTimeout(() => {
        setZoomLevel(1);
      }, 4000));

      // 4. Resume scrolling
      sequenceTimeouts.push(setTimeout(() => {
        setSimulationDone(true);
      }, 4500));
    };
    
    // Initial delay
    delayTimeout = setTimeout(startScroll, 2000);

    return () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (delayTimeout) clearTimeout(delayTimeout);
      sequenceTimeouts.forEach(clearTimeout);
    };
  }, [isAutoScroll, simulationDone]); // videoSectionRef doesn't change, toggleMute handled by ref

  return { zoomLevel };
};
