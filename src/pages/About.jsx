import { useState, useEffect } from "react";
import Jointeam from "../components/Jointeam";
import Form from "../components/Popupform";
import Arrow from "../assets/rightarrow.svg";
import Choose from "../sections/Choose";
import Promise from "../sections/Promise";
import { useNavigate } from "react-router-dom";
import FortImage from "/images/fort.webp";
import FriskyLoader from "../components/Loader";

const About = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showJointeam, setShowJointeam] = useState(false);

  const toggleForm = () => setShowForm((prev) => !prev);
  const toggleJointeam = () => setShowJointeam((prev) => !prev);

  const handleScroll = () => {
    setShowForm(false);
    setShowJointeam(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // same as Home

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
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
    <div className="min-h-screen mt-20 md:mt-26 lg:mt-24 xl:mt-28 w-full">
      {/* HERO IMAGE DESKTOP */}
      <div
        className="hidden lg:block"
        style={{
          height: "370px",
          backgroundImage: `url('/about.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* HERO IMAGE MOBILE */}
      <div
        className="block lg:hidden"
        style={{
          height: "320px",
          backgroundImage: `url('/about.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* MAIN HEADING */}
      <h1 className="text-center mt-6 md:mt-12 text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900">
        Explore India With Us
      </h1>

      {/* WHY SECTION */}
      <div>
        <h1 className="text-2xl md:text-4xl font-semibold mt-2 md:mt-16 text-[rgb(255,99,33)] text-center">
          Why FriskyTrails?
        </h1>

        <div className="w-full md:w-[70vw] mx-auto flex justify-center px-4">
          <p className="text-center mt-2 md:mt-8 text-base md:text-xl text-gray-600">
            <b>
              At FriskyTrails, we believe that travel isn't just about reaching a
              destination—
            </b>
            it's about the thrill of the journey, the experiences that shape us,
            and the stories we create along the way. Whether you're an adrenaline
            junkie, a nature lover, or someone looking to escape the ordinary, we
            bring you 100+ adventure activities and 500+ tour packages across
            200+ breathtaking locations in India.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center pb-6 md:pb-10 gap-4 md:gap-10 px-4">
          {/* OPEN FORM BUTTON */}
          <button
            onClick={toggleForm}
            className="w-full sm:w-auto bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 mt-4 md:mt-8 border border-transparent flex items-center justify-center gap-1 font-semibold rounded-full active:scale-95 transition-all duration-300 hover:brightness-110 text-white px-6 md:px-8 py-3 md:py-4 shadow-lg"
          >
            Our Packages
            <img
              className="w-4 h-4 md:w-5 md:h-5 invert"
              src={Arrow}
              alt="Arrow"
            />
          </button>

          {/* FORM MODAL */}
          {showForm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3"
              onClick={() => setShowForm(false)}
            >
              <div
                className="w-full max-w-[92vw] sm:max-w-sm md:max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white rounded-t-2xl border-b border-gray-100">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    Plan Your Adventure
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 text-gray-500 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-4 py-4 md:px-6 md:py-5">
                  <Form onClose={() => setShowForm(false)} />
                </div>
              </div>
            </div>
          )}

          {/* CALL BUTTON */}
          <button className="w-full sm:w-auto bg-white mt-2 md:mt-8 border-2 border-[rgb(255,99,33)] font-semibold rounded-full active:scale-95 transition-all duration-300 hover:bg-[rgb(255,99,33)] hover:text-white px-6 md:px-8 py-3 md:py-4 shadow-lg">
            <a href="tel:+917501516714">+91-75015 16714</a>
          </button>
        </div>
      </div>

      <Promise />
      <Choose />

      {/* CAREER SECTION */}
      <div className="px-4 pb-12 md:px-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-12 md:mt-24 text-center">
          Let's Redefine Adventure,{" "}
          <span className="text-[rgb(255,99,33)] font-bold">TOGETHER!</span>
        </h1>

        <div className="flex mt-6 justify-center">
          <button
            onClick={() => navigate("/hiring")}
            className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 font-semibold rounded-full text-white px-8 md:px-12 py-3 md:py-4 shadow-xl text-lg md:text-xl"
          >
            Join Our Team!
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
