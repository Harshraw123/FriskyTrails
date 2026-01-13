import { useEffect, useState } from "react";
import { hotelBooking } from "../api/hotel.api"; // Correct API import
import { useAuth } from "../context/AuthContext";

const HotelForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    city: "",
    property: "",
    checkInDate: "",
    checkOutDate: "",
    guests: "",
    budget: "",
  });

  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await hotelBooking(formData);
      if (response.success) {
        alert("Hotel booked successfully!");
      } else {
        alert("Failed to book hotel.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (!user && !errorMessage) {
        alert("Please login First");
      } else {
        alert(errorMessage || "An error occurred. Please try again.");
      }
    }
    setFormData({
      city: "",
      property: "",
      checkInDate: "",
      checkOutDate: "",
      guests: "",
      budget: "",
    });
    setShowMobileForm(false);
  };

  const labels = {
    city: "City",
    property: "Property",
    checkInDate: "Check-In",
    checkOutDate: "Check-Out",
    guests: "Guests",
    budget: "Budget (in ₹)",
  };

  const placeholders = {
    city: "Enter city",
    property: "Enter property name",
    checkInDate: "Select date",
    checkOutDate: "Select date",
    guests: "No. of guests",
    budget: "Enter budget",
  };

  return (
    <>
      {/* Tablet/Desktop Form */}
      <div className="hidden md:block bg-white h-auto w-[90vw] rounded-lg z-20 absolute bottom-40 lg:bottom-60 xl:bottom-20 left-1/2 transform -translate-x-1/2 shadow-lg px-10 py-4">
        <h2 className="text-2xl text-orange-400 font-bold pb-4 text-center">
          Hotels
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6 justify-center items-center w-full xl:flex-nowrap xl:gap-10"
        >
          {Object.keys(formData).map((field, index) => (
            <div className="w-full md:w-[30%]" key={index}>
              <label className="block font-semibold mb-1 pl-1">
                {labels[field]}
              </label>
              {field === "price" ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name={field}
                    placeholder={placeholders[field]}
                    value={formData[field]}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full pl-8 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              ) : (
                <input
                  type={
                    field === "checkInDate" || field === "checkOutDate"
                      ? "date"
                      : field === "guests"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  placeholder={placeholders[field]}
                  value={formData[field]}
                  onChange={handleChange}
                  min={
                    field === "checkInDate" || field === "checkOutDate"
                      ? new Date().toISOString().split("T")[0]
                      : "0"
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              )}
            </div>
          ))}
          <div className="w-full md:w-auto">
            <button
              type="submit"
              className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:scale-95 py-3 px-6 mt-2 xl:mt-6 text-white rounded-xl font-semibold w-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Trigger Button */}
      <div className="md:hidden relative text-center bottom-10 z-10">
        <button
          onClick={() => setShowMobileForm(true)}
          className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:bg-amber-400 text-white px-6 py-3 rounded-xl shadow-md font-semibold"
        >
          Book My Stay
        </button>
      </div>

      {/* Mobile Popup Form - ✅ SAME TOP MARGIN ✅ */}
      {showMobileForm && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40 flex items-center justify-center pt-16 md:pt-0">
          <div className="relative w-[90vw] max-w-sm max-h-[80vh] bg-white rounded-xl shadow-xl px-4 py-6 overflow-y-auto border border-gray-200">
            <button
              className="absolute  mt-7 top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-500 p-2"
              onClick={() => setShowMobileForm(false)}
            >
              &times;
            </button>

            <h2 className="text-xl pt-10 text-orange-400 font-bold pb-4 text-center">
              Hotels
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full mt-4">
              {Object.keys(formData).map((field, index) => (
                <div className="w-full" key={index}>
                  <label className="block font-semibold mb-1 pl-1 text-sm">
                    {labels[field]}
                  </label>
                  {field === "price" ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        name={field}
                        placeholder={placeholders[field]}
                        value={formData[field]}
                        onChange={handleChange}
                        min="0"
                        step="100"
                        className="w-full pl-8 p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        required
                      />
                    </div>
                  ) : (
                    <input
                      type={
                        field === "checkInDate" || field === "checkOutDate"
                          ? "date"
                          : field === "guests"
                          ? "number"
                          : "text"
                      }
                      name={field}
                      placeholder={placeholders[field]}
                      value={formData[field]}
                      onChange={handleChange}
                      min={
                        field === "checkInDate" || field === "checkOutDate"
                          ? new Date().toISOString().split("T")[0]
                          : "0"
                      }
                      className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      required
                    />
                  )}
                </div>
              ))}

              <div className="w-full pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:scale-95 py-3 px-6 mt-2 text-white rounded-xl font-semibold w-full text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HotelForm;
