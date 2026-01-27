import { useEffect, useState } from "react";
import Right from "../assets/right.svg";
import Blogleft from "../components/Blogleft";
import Blogright from "../components/Blogright";
import { getSingleBlog } from "../api/blog.api";
import { useParams } from "react-router-dom";
import FriskyLoader from "../components/Loader";

const Newlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getSingleBlog(slug);
        setBlog(res);
      } catch (err) {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading || !blog) {
    return (
      <div 
        className="flex items-center justify-center min-h-[70vh] py-20 px-4"
       
      >
        <FriskyLoader />
      </div>
    );
  }
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!blog) return null;

  return (
    <div className="min-h-screen mt-12 md:mt-20 lg:mt-24 w-full">
      <div
        className="w-full min-h-[460px] bg-no-repeat md:bg-contain"
        style={{
          backgroundImage: "url('/images/bgbanner.svg')",
        }}
      >
        {/* <div className="flex items-center gap-2 px-4 xl:pl-20 pt-6 text-sm sm:text-base">
          <h3 className="font-semibold">{blog.country.name}</h3>
          <img className="h-4 w-4 mt-1" src={Right} alt="rightarrow" />
          <h3 className="font-semibold">{blog.state.name}</h3>
          <img className="h-4 w-4 mt-1" src={Right} alt="rightarrow" />
          <h3 className="font-semibold text-gray-600">{blog.city.name}</h3>
        </div> */}
        <div className="flex items-center gap-2 px-4 xl:pl-20 pt-8 md:pt-6 text-sm sm:text-base">
          {blog.country && (
            <h3 className="font-semibold">{blog.country?.name}</h3>
          )}
          {blog.country && blog.state && (
            <img className="h-4 w-4 mt-1" src={Right} alt="rightarrow" />
          )}
          {blog.state && <h3 className="font-semibold">{blog.state?.name}</h3>}
          {blog.state && blog.city && (
            <img className="h-4 w-4 mt-1" src={Right} alt="rightarrow" />
          )}
          {blog.city && (
            <h3 className="font-semibold text-gray-600">{blog.city?.name}</h3>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl xl:pl-20 md:text-4xl font-semibold tracking-tighter px-4 pt-4 md:pt-4">
          {blog.title}
        </h1>

        <img
          className="mx-auto rounded-2xl mt-6 w-[90vw] h-[32vh] md:h-[40vh] max-w-5xl"
          src={blog.coverImage}
          alt="image"
        />
        {/* Blog Section */}
        <div className="w-full flex justify-center flex-col lg:flex-row pt-0 md:pt-10">
          {/* Left sidebar */}

          {/* <div className="lg:w-[15%] hidden xl:flex flex-col pl-6 items-center sticky top-0">
            <div className="flex gap-4 pt-6">
              <a href="https://www.facebook.com/friskytrails/" target="_blank">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  src={Facebook}
                  alt=""
                  />
              </a>
              <a href="https://x.com/frisky_trails" target="_blank">
                <img className="w-8 h-8 sm:w-10 sm:h-10" src={Twitter} alt="" />
              </a>
              <a
                href="https://www.linkedin.com/company/friskytrails/"
                target="_blank"
                >
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  src={Linkedin}
                  alt=""
                  />
              </a>
              <a href="https://www.instagram.com/friskytrails/" target="_blank">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  src={Instagram}
                  alt=""
                  />
              </a>

          </div>
            <div className="hidden xl:block w-[100%] h-[200px] sm:h-[300px] lg:h-[78vh] mt-4 bg-[url('/blogimages/blogbanner.png')] bg-cover bg-center rounded-lg shadow-lg" />
                  </div> */}

          {/* Middle content */}
          {/* <div className="flex w-full gap-6"> */}
          {/* Left content */}
          <div className="lg:w-[60%] pt-3 w-full">
            <Blogleft blog={blog} />
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block lg:w-[30%]">
            <div className="sticky top-26">
              {" "}
              {/* adjust top spacing if you have a navbar */}
              <Blogright />
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newlog;
