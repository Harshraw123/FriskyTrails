import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Right from "../assets/right.svg";
import Share from "../assets/share.svg";
import Payment from "../assets/payment.svg";
import Call from "../assets/calling.svg";

import toast, { Toaster } from "react-hot-toast";

import {
  getProductBySlug,
  getProductTypeById,
  getCityById,
} from "../api/admin.api";
import Content from "../Productpage/Content";
import BookingModal from "../components/BookingModal";
import Choose from "../sections/Choose";
import FriskyLoader from "../components/Loader";
import { MapPin } from "lucide-react";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [thingsToCarry, setThingsToCarry] = useState([]);
  const [howToReach, setHowToReach] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =====================
     SHARE HANDLER (ADDED)
  ===================== */
  const handleShare = async () => {
    try {
      const url = `https://www.friskytrails.in//tours/${slug}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link",error);
    }
  };

  // Auto image slider for mobile
  useEffect(() => {
    if (!product?.images || product.images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product?.images]);

  // Fetch product, product type, and city details
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productRes = await getProductBySlug(slug);
        const productData = productRes.data;
        setProduct(productData);

        if (productData.productType) {
          const typeRes = await getProductTypeById(productData.productType);
          let carryData = typeRes.data.thingsToCarry || "";

          if (carryData) {
            try {
              const parsed = JSON.parse(carryData);
              setThingsToCarry(Array.isArray(parsed) ? parsed : [carryData]);
            } catch {
              setThingsToCarry(carryData);
            }
          }
        }

        if (productData.city?._id) {
          const cityRes = await getCityById(productData.city._id);
          setHowToReach(cityRes.data?.howToReach || "");
        }
      } catch (error) {
        console.error("Error fetching product/type/city:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  const openBookingModal = () => setShowBooking(true);
  const closeBookingModal = () => setShowBooking(false);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] py-20 px-4">
        <FriskyLoader size="sm" text="Loading product details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* TOASTER (ADDED) */}


      {/* Breadcrumb */}
      <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mt-25 lg:mt-30  m-auto px-4">
        {/* <div className="flex items-center pt-4 sm:pt-6 flex-wrap gap-2">
          <h3 className="font-semibold text-sm sm:text-base">Home</h3>
          <img className="h-3 w-3 sm:h-4 sm:w-4 mt-1" src={Right} alt="rightarrow" />
          <h3 className="font-semibold text-sm sm:text-base">Products</h3>
          <img className="h-3 w-3 sm:h-4 sm:w-4 mt-1" src={Right} alt="rightarrow" />
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base truncate">
            {product.name}
          </h3>
        </div> */}

        <h1 className="text-xl sm:text-2xl  md:text-3xl tracking-tighter font-bold pt-6">
          {product.name}
        </h1>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <h3 className="text-gray-500 text-sm sm:text-base">
              ⭐ {product.rating} ({product.reviews || 0} Reviews)
            </h3>
            <h3 className="flex items-center gap-1 text-gray-500 text-sm sm:text-base">
  <MapPin size={16} className="text-gray-500" />
  {product.city?.name}, {product.state?.name}
</h3>
          </div>

          {/* SHARE BUTTON (onClick ADDED) */}
          <button
            onClick={handleShare}
            className="py-2 flex items-center justify-center gap-2 px-4 sm:px-6 font-semibold text-white active:scale-95 transition-all duration-300 bg-[rgb(233,99,33)] rounded-3xl text-sm sm:text-base w-fit"
          >
            <img className="invert h-4 w-4 sm:h-5 sm:w-5" src={Share} alt="share" />
            Share
          </button>
        </div>
      </div>

      {/* Images Section */}
      <div className="h-auto w-full pt-4 px-4">
        <div className="w-full max-w-7xl rounded-lg bg-white m-auto">
          {product.images && product.images.length > 0 && (
            <>
              {/* Mobile & Tablet Auto Slider */}
              <div className="block lg:hidden relative overflow-hidden rounded-xl shadow-2xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-full h-64 sm:h-80 relative overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${img}')` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 w-2 rounded-full ${
                        currentIndex === idx ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Desktop Grid View */}
              <div className="hidden lg:grid grid-cols-3 gap-3">
                <div className="space-y-3">
                  {product.images.slice(0, 2).map((img, idx) => (
                    <div
                      key={idx}
                      className="h-56 w-full rounded-2xl shadow-2xl relative overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                        style={{ backgroundImage: `url('${img}')` }}
                      ></div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-[28rem] w-full rounded-2xl shadow-2xl relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                      style={{
                        backgroundImage: `url('${
                          product.images[2] || product.images[0]
                        }')`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {product.images.slice(3, 5).map((img, idx) => (
                    <div
                      key={idx}
                      className="h-56 w-full rounded-2xl shadow-2xl relative overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                        style={{ backgroundImage: `url('${img}')` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Section */}
      <div className="w-[100%] sm:w-[90%] md:w-[85%] lg:w-[90%] m-auto flex flex-col lg:flex-row px-4 gap-8 mt-6 md:mt-10">
        {/* Left - Content */}
        <div className="w-full lg:w-[70%] lg:order-1">
          <Content
            product={product}
            howToReach={howToReach}
            thingsToCarry={thingsToCarry}
          />
        </div>

        {/* Right - Sidebar */}
        <div className="w-full lg:w-[30%] lg:order-2 pt-14 lg:pl-6">
          <div className="lg:sticky lg:top-28">
            <div className="hidden lg:block bg-white border border-orange-500 rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-500 py-4 relative">
                <span className="text-white absolute right-2 top-1 text-xs sm:text-sm md:text-base">
                  Save 28.58%
                </span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <span className="font-semibold text-xs sm:text-sm md:text-base">
                    From
                  </span>
                  <span className="line-through pl-2 text-base sm:text-lg md:text-xl text-gray-500">
                    ₹{product.actualPrice}
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500">
                    ₹{product.offerPrice}
                  </h1>
                  <span className="font-semibold text-xs sm:text-sm md:text-base">
                    per person
                  </span>
                </div>
                <button
                  onClick={openBookingModal}
                  className="py-2 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg font-semibold text-white active:scale-95 transition-all duration-300 bg-[rgb(233,99,33)] rounded-3xl"
                >
                  Book Now
                </button>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 px-4 pb-4">
                <img
                  className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                  src={Payment}
                  alt="payment"
                />
                <p className="text-xs sm:text-sm md:text-base leading-snug">
                  <span className="underline font-semibold">
                    Reserve now & pay later
                  </span>{" "}
                  to book your spot and pay nothing today
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="hidden md:block bg-white border border-orange-500 rounded-lg shadow-md p-4 mb-2 md:mb-0 md:mt-10 sm:p-5">
              <h1 className="text-orange-500 text-lg sm:text-xl md:text-2xl font-semibold">
                Got a Question?
              </h1>
              <p className="text-sm sm:text-base md:text-lg mt-2">
                Our destination expert will be happy to help you resolve your
                queries for this tour.
              </p>
              <div className="flex gap-3 sm:gap-4 items-center w-full mt-4">
                <div className="flex items-center justify-center bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                  <img
                    className="h-4 w-4 sm:h-5 sm:w-5 invert"
                    src={Call}
                    alt="call"
                  />
                </div>
                <div>
                  <a
                    className="text-base sm:text-lg md:text-xl font-semibold block"
                    href="tel:+91-7501516714"
                  >
                    +91-75015 16714
                  </a>
                  <h3 className="text-xs sm:text-sm">Mon-Sun: 9AM-8PM</h3>
                  <h3 className="text-xs sm:text-sm break-all font-semibold">
                    <a href="mailto:contact@friskytrails.in" className="text-black md:hidden lg:block">
                      contact@friskytrails.in
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Book Now Bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 w-full bg-white border-t border-orange-500 shadow-md py-5 px-2 flex justify-between items-center z-50">
        <div className="flex flex-col justify-center">
          <span className="text-md line-through text-gray-500">
            ₹{product.actualPrice}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-orange-500">
              ₹{product.offerPrice}
            </span>
            <span className="text-md text-gray-600">per person</span>
          </div>
        </div>
        <button
          onClick={openBookingModal}
          className="py-2 px-4 text-base font-semibold text-white bg-[rgb(233,99,33)] rounded-3xl active:scale-95 transition-all duration-300"
        >
          Book Now
        </button>
      </div>

      <div className="lg:mt-10 -mt-20 lg:mb-4">
        <Choose />
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal productSlug={product.slug} onClose={closeBookingModal} />
      )}
    </div>
  );
};

export default ProductDetails;
