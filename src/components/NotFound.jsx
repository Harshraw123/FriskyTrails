import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="
        pt-[110px]              /* top info bar + navbar */
        min-h-screen
        px-4 py-10
        sm:px-6
        md:px-12
        lg:px-20
        bg-[#fbf7ec]
        flex flex-col
      "
    >
      {/* MAIN CONTENT (vertically centered on tall screens) */}
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Left Section */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Coming Soon...
              </h1>

              <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed">
                For tour-related inquiries, please feel free to contact us through the following methods:
              </p>

              {/* Contact Info */}
              <div className="space-y-5 mb-10">
                
                {/* Phone */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-800" />
                    <span className="font-bold text-gray-800">
                      Call Us for details :
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-2">
                    <span className="text-gray-700 font-semibold">
                      +91-75015 16714
                    </span>
                    <span className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 bg-clip-text text-transparent font-bold">
                      (Toll Free)
                    </span>
                  </div>
                </div>

                {/* Mail */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-800" />
                    <span className="font-bold text-gray-800">
                      Mail Us for details :
                    </span>
                  </div>
                  <a
                    href="mailto:contact@friskytrails.in"
                    className="font-semibold text-gray-700 hover:underline sm:ml-2"
                  >
                    contact@friskytrails.in
                  </a>
                </div>
              </div>

              {/* CTA */}
              <Link to="/contact">
                <button className="px-7 py-3 bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 text-white font-semibold rounded-md hover:opacity-90 transition">
                  Enquire Now
                </button>
              </Link>
            </div>

            {/* Right Section - Image */}
            <div className="flex-1 flex justify-center">
              <img
                src="/NotFound.png"
                alt="Travelers with map"
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE (naturally near bottom) */}
      <div className="mt-16 pt-8 border-t border-gray-200 max-w-5xl">
        <p className="text-sm md:text-base leading-relaxed text-gray-800">
          <span className="font-bold">Please Note : </span>
          <span className="font-semibold">
            The prices shown are reference pricing and based on previous foreign exchange rates.
            The exact foreign exchange rate will be applicable at the time of booking.
            The tour price may vary.
          </span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
