import { useState, useEffect } from "react";
import HillImage from "/images/blog.webp";
import Box from "../sections/Box";
import Latestblog from "../sections/Latestblog";
import Cards from "../sections/Cards";
import FriskyLoader from "../components/Loader";

const Blog = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // same loader timing

    return () => clearTimeout(timer);
  }, []);

  // 🔥 LOADER
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] py-20 px-4">
        <FriskyLoader size="md" text="" />
      </div>
    );
  }

  return (
    <div className="w-full mt-12 md:mt-20 lg:mt-26 xl:mt-28">
      {/* HERO */}
      <div
        style={{
          height: "400px",
          backgroundImage: `url(${HillImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight pt-20 md:pt-34">
            Your Ultimate Companion for Everywhere!
          </h1>

          <p className="text-base md:text-xl pt-4">
            Searching for Travel Guides, Destinations, and Adventure for Joyful
            Journey Ahead?
          </p>

          <button className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 mt-4 md:mt-8 text-base md:text-xl text-white font-bold rounded-lg px-4 md:px-6 py-2">
            <div className="flex gap-1">Dive into the Blog!</div>
          </button>
        </div>
      </div>

      {/* TRENDING */}
      <div className="trends">
        <h1 className="text-3xl md:text-4xl tracking-tighter pt-10 md:pt-20 font-semibold pl-4 md:pl-32">
          Trending Blogs
        </h1>

        <div className="mt-6">
          <Box />
        </div>

        <div className="LatestBlog md:p-10">
          <Latestblog />
        </div>
      </div>

      {/* CARDS */}
      <div className="mt-[-30px]">
        <Cards />
      </div>
    </div>
  );
};

export default Blog;
