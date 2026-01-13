import { useEffect, useState } from "react";
import { flight } from "../api/flight.api";
import { useAuth } from "../context/AuthContext";

const FlightsForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    departureDate: "",
    returnDate: "",
    travelClass: "",
    passengers: "",
    price: "",
    airline: "",
  });

  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await flight(formData);
      if (response.success) {
        alert("Flight booked successfully!");
      } else {
        alert("Failed to book flight.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (!user && !errorMessage) {
        alert("Please login first");
      } else {
        alert(errorMessage || "An error occurred. Please try again.");
      }
    }

    setFormData({
      fromCity: "",
      toCity: "",
      departureDate: "",
      returnDate: "",
      travelClass: "",
      passengers: "",
      price: "",
      airline: "",
    });
    setShowMobileForm(false);
  };

  const labels = {
    fromCity: "From",
    toCity: "To",
    departureDate: "Departure",
    returnDate: "Return (Optional)",
    travelClass: "Class",
    passengers: "Passengers",
    price: "Price",
    airline: "Airline",
  };

  const placeholders = {
    fromCity: "Enter departure city",
    toCity: "Enter destination city",
    departureDate: "Select departure date",
    returnDate: "Select return date",
    travelClass: "Select class",
    passengers: "Number of passengers",
    price: "Enter price",
    airline: "Enter airline name",
  };

  const classOptions = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];

  return (
    <>
      {/* Tablet/Desktop Form */}
      <div className="hidden md:block bg-white h-auto w-[90vw] rounded-lg z-20 absolute bottom-40 lg:bottom-60 xl:bottom-20 left-1/2 transform -translate-x-1/2 shadow-lg px-10 py-4 overflow-visible">
        <h2 className="text-2xl mt-6 text-orange-400 font-bold pb-4 text-center">
          Flights
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

              {field === "travelClass" ? (
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                >
                  <option value="" disabled>
                    {placeholders[field]}
                  </option>
                  {classOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    ["departureDate", "returnDate"].includes(field)
                      ? "date"
                      : field === "passengers" || field === "price"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  placeholder={placeholders[field]}
                  onChange={handleChange}
                  min={
                    ["departureDate", "returnDate"].includes(field)
                      ? new Date().toISOString().split("T")[0]
                      : "0"
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required={
                    field !== "returnDate" &&
                    field !== "price" &&
                    field !== "airline"
                  }
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:scale-95 py-3 px-6 mt-2 xl:mt-6 text-white rounded-xl font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Mobile Trigger Button */}
      <div className="md:hidden relative text-center bottom-10 z-10">
        <button
          onClick={() => setShowMobileForm(true)}
          className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 text-white px-6 py-3 rounded-xl shadow-md font-semibold"
        >
          Book My Flight
        </button>
      </div>

      {/* Mobile Popup Form - ✅ FIXED WITH TOP MARGIN */}
      {showMobileForm && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40 flex items-center justify-center pt-16  md:pt-0">
          <div className="relative w-[95vw] max-w-sm max-h-[85vh] bg-white rounded-xl shadow-xl px-4 py-6 overflow-y-auto border border-gray-200">
            
            {/* Close Button */}
            <button
              className="absolute  mt-8 top-3 right-3 text-2xl font-bold text-gray-500 hover:text-red-500 z-10 p-2"
              onClick={() => setShowMobileForm(false)}
            >
              &times;
            </button>

            {/* HEADING */}
            <h2 className="text-xl pt-10 text-orange-400 font-bold text-center">
              Flights
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 w-full mt-4"
            >
              {Object.keys(formData).map((field, index) => (
                <div className="w-full" key={index}>
                  <label className="block font-semibold mb-1 pl-1 text-sm">
                    {labels[field]}
                  </label>

                  {field === "travelClass" ? (
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      required
                    >
                      <option value="" disabled>
                        {placeholders[field]}
                      </option>
                      {classOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        ["departureDate", "returnDate"].includes(field)
                          ? "date"
                          : field === "passengers" || field === "price"
                          ? "number"
                          : "text"
                      }
                      name={field}
                      value={formData[field]}
                      placeholder={placeholders[field]}
                      onChange={handleChange}
                      min={
                        ["departureDate", "returnDate"].includes(field)
                          ? new Date().toISOString().split("T")[0]
                          : "0"
                      }
                      className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      required={
                        field !== "returnDate" &&
                        field !== "price" &&
                        field !== "airline"
                      }
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:scale-95 py-3 px-6 mt-3 text-white rounded-xl font-semibold text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightsForm;
