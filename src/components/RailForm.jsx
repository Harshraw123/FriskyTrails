import { useState } from "react";
import { railTicket } from "../api/railTicket.api";
import { useAuth } from "../context/AuthContext";

const RailForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fromStation: "",
    toStation: "",
    departureDate: "",
    returnDate: "",
    travelClass: "",
    passengers: "",
    // price: "",
  });

  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await railTicket(formData);
      if (response.success) alert("Rail ticket booked successfully!");
      else alert("Failed to book rail ticket.");
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (!user && !errorMessage) {
        alert("Please login first");
      } else {
        alert(errorMessage || "An error occurred. Please try again.");
      }
    }

    setFormData({
      fromStation: "",
      toStation: "",
      departureDate: "",
      returnDate: "",
      travelClass: "",
      passengers: "",
      // price: "",
    });
    setShowMobileForm(false);
  };

  const labels = {
    fromStation: "From",
    toStation: "To",
    departureDate: "Departure",
    returnDate: "Return",
    travelClass: "Class",
    passengers: "Passengers",
    // price: "Price (₹)",
  };

  const placeholders = {
    fromStation: "From station",
    toStation: "To station",
    passengers: "Passengers",
    // price: "Price",
  };

  return (
    <>
      {/* ========== Desktop / Tablet ========= */}
      <div className="hidden md:flex lg:mb-10  bg-white w-[88vw] rounded-lg z-20 absolute bottom-40 lg:bottom-60 xl:bottom-20 left-1/2 transform -translate-x-1/2 shadow-md px-6 py-3">
        <div className="w-full">
          <h2 className="text-2xl text-orange-400 font-bold pb-4 text-center">
            Rail Tickets
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-8 gap-3 items-end w-full"
          >
            {Object.keys(formData).map((field, index) => (
              <div className="flex flex-col" key={index}>
                <label className="block text-xs font-semibold mb-1 pl-1">
                  {labels[field]}
                </label>

                {field === "travelClass" ? (
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-400"
                    required
                  >
                    <option value="">Class</option>
                    <option value="Sleeper">Sleeper</option>
                    <option value="AC">AC</option>
                    <option value="General">General</option>
                  </select>
                ) : (
                  <input
                    type={
                      ["departureDate", "returnDate"].includes(field)
                        ? "date"
                        : ["passengers", "price"].includes(field)
                        ? "number"
                        : "text"
                    }
                    name={field}
                    placeholder={placeholders[field]}
                    value={formData[field]}
                    onChange={handleChange}
                    min={0}
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-400"
                    required={field !== "returnDate"}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:scale-95 px-4 py-2.5 text-white rounded-lg text-sm font-semibold col-span-1 md:col-span-1"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* ========== Mobile Trigger ========= */}
      <div className="md:hidden text-center bottom-10 relative z-10">
        <button
          onClick={() => setShowMobileForm(true)}
          className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Book Tickets
        </button>
      </div>

      {/* ========== Mobile Modal ========= */}
      {showMobileForm && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40 flex items-center justify-center pt-12">
          <div className="relative w-[90vw] max-w-sm max-h-[75vh] bg-white rounded-lg shadow-xl px-4 py-4 overflow-y-auto">
            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-500"
              onClick={() => setShowMobileForm(false)}
            >
              ×
            </button>

            <h2 className="text-lg text-orange-400 font-bold text-center pt-6">
              Rail Tickets
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
              {Object.keys(formData).map((field, index) => (
                <div key={index}>
                  <label className="block text-xs font-semibold mb-1">
                    {labels[field]}
                  </label>

                  {field === "travelClass" ? (
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-400"
                      required
                    >
                      <option value="">Class</option>
                      <option value="Sleeper">Sleeper</option>
                      <option value="AC">AC</option>
                      <option value="General">General</option>
                    </select>
                  ) : (
                    <input
                      type={
                        ["departureDate", "returnDate"].includes(field)
                          ? "date"
                          : ["passengers", "price"].includes(field)
                          ? "number"
                          : "text"
                      }
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      min={0}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-400"
                      required={field !== "returnDate"}
                      placeholder={placeholders[field]}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 py-2.5 text-white rounded-lg text-sm font-semibold mt-2"
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

export default RailForm;
