import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const Landing = () => {
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.muted = !desktopVideoRef.current.muted;
      setIsMuted(desktopVideoRef.current.muted);
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.muted = !mobileVideoRef.current.muted;
      setIsMuted(mobileVideoRef.current.muted);
    }
  };

  // 🔥 AUTO MUTE WHEN USER SCROLLS
  useEffect(() => {
    const handleScroll = () => {
      if (!isMuted) {
        if (desktopVideoRef.current) {
          desktopVideoRef.current.muted = true;
        }
        if (mobileVideoRef.current) {
          mobileVideoRef.current.muted = true;
        }
        setIsMuted(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMuted]);

  return (
    <div className="relative mt-20 md:mt-24 lg:mt-30 xl:mt-28 w-full h-auto bg-[rgb(247, 241, 231)] overflow-hidden">
      {/* Background Video */}
      <div className="h-[72vh] md:h-[62vh] w-full">
        <video
          className="absolute md:block h-[62vh] top-0 w-full left-0 object-cover"
          ref={desktopVideoRef}
          src="/images/Webvi.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <video
          className="absolute md:hidden top-0 w-full h-[72vh] left-0 object-cover"
          ref={mobileVideoRef}
          src="/images/mobile.webm"
          autoPlay
          loop
          muted
          playsInline
        />
        <button
          onClick={toggleMute}
          className="absolute mt-4 md:mt-0 z-20 top-4 right-4 bg-white/20 backdrop-blur-md text-black p-2 md:p-3 rounded-full hover:bg-white/30 transition shadow-md"
        >
          {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
        </button>
      </div>

      <div className="animation w-full">
        <div className="relative text flex whitespace-nowrap overflow-hidden">
          <motion.h1
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ ease: "linear", repeat: Infinity, duration: 12 }}
            md:transition={{ ease: "linear", repeat: Infinity, duration: 22 }}
            className="text-7xl font-bold"
          >
            <span className="flex justify-center items-center ml-20 md:ml-40 text-white md:[text-shadow:_-1.5px_-1.5px_0_#0a0322,1.5px_1.5px_0_#0a0322,-1.5px_1.5px_0_#0a0322,1.5px_-1.5px_0_#0a0322]
[text-shadow:_-1px_-1px_0_rgba(10,3,34,0.25),1px_1px_0_rgba(10,3,34,0.25),-1px_1px_0_rgba(10,3,34,0.25),1px_-1px_0_rgba(10,3,34,0.25)]
">
              <img
                className="h-20 w-20 md:h-40 md:w-40"
                src="/logo.PNG"
                alt=""
              />
              <h1 className="md:text-6xl text-3xl">
                Explore every destination, Every season – with FriskyTrails!
              </h1>
            </span>
          </motion.h1>

          <motion.h1
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ ease: "linear", repeat: Infinity, duration: 12 }}
            md:transition={{ ease: "linear", repeat: Infinity, duration: 22 }}
            className="text-7xl font-bold"
          >
            <span className="flex justify-center items-center ml-20 md:ml-40 text-white md:[text-shadow:_-1.5px_-1.5px_0_#0a0322,1.5px_1.5px_0_#0a0322,-1.5px_1.5px_0_#0a0322,1.5px_-1.5px_0_#0a0322]
[text-shadow:_-1px_-1px_0_rgba(10,3,34,0.25),1px_1px_0_rgba(10,3,34,0.25),-1px_1px_0_rgba(10,3,34,0.25),1px_-1px_0_rgba(10,3,34,0.25)]
">
              <img
                className="h-20 w-20 md:h-40 md:w-40"
                src="/logo.PNG"
                alt=""
              />
              <h1 className="md:text-6xl text-3xl">
                Explore every destination, Every season – with FriskyTrails!
              </h1>
            </span>
          </motion.h1>
        </div>
      </div>
    </div>
  );
};

export default Landing;
