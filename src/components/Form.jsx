import { useEffect, useState } from "react";
import { adventure } from "../api/adventure.api";
import { useAuth } from "../context/AuthContext";

const Form = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    duration: "",
    budget: "",
    date: "",
    guests: "",
  });

  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await adventure({ fromCity: formData.from, toCity: formData.to, duration: formData.duration, budget: formData.budget, date: formData.date, guests: formData.guests });
      if (response.success) {
        alert("Adventure booked successfully!");
      } else { 
        alert("Failed to book adventure.");
      }
    }catch (error) {
      const errorMessage = error.response?.data?.message;
      if (!user && !errorMessage) {
        alert('Please login first');
      } else {
        alert(errorMessage || "An error occurred. Please try again.");
      }
    }
    setFormData({
      from: "",
      to: "",
      duration: "",
      budget: "",
      date: "",
      guests: "",
    });
    setShowMobileForm(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileForm(false);
    };

    if (showMobileForm) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMobileForm]);

  const labels = {
    from: "From City",
    to: "To City",
    duration: "Duration (in Days)",
    budget: "Budget (in ₹)",
    date: "Departure Date",
    guests: "No. of Guests",
  };

  const placeholders = {
    from: "Enter location",
    to: "Enter destination",
    duration: "Enter duration",
    budget: "Enter amount",
    guests: "No. of persons",
  };

  return (
    <>
      {/* ============ Tablet/Desktop Form ============ */}
      <div className="hidden md:block bg-white h-auto w-[90vw] rounded-lg z-20 absolute bottom-40 lg:bottom-60 xl:bottom-20 left-1/2 transform -translate-x-1/2 shadow-lg px-10 py-4">
        <h2 className="text-2xl text-orange-400 font-bold pb-4 text-center">
          Where's Your Next Adventure?
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
              <input
                type={
                  field === "date"
                    ? "date"
                    : ["budget", "duration", "guests"].includes(field)
                    ? "number"
                    : "text"
                }
                name={field}
                placeholder={placeholders[field]}
                value={formData[field]}
                onChange={handleChange}
                min={field === "date" ? new Date().toISOString().split("T")[0] : "0"}
                step={field === "budget" ? "1000" : undefined}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
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

      {/* ============ Mobile Trigger Button ============ */}
      <div className="md:hidden relative text-center bottom-10 z-10">
        <button
          onClick={() => setShowMobileForm(true)}
          className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:bg-amber-400 text-white px-6 py-3 rounded-xl shadow-md font-semibold"
        >
          Plan My Trip
        </button>
      </div>

      {/* ============ Mobile Popup Form ============ */}
      {showMobileForm && (
        <div className="md:hidden fixed top-[20%] left-1/2 transform -translate-x-1/2 w-[90vw] h-auto py-8 bg-white rounded-xl shadow-xl z-30 px-4 border border-gray-200 overflow-y-auto">
          {/* Close Button */}
          <button
            className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-500"
            onClick={() => setShowMobileForm(false)}
          >
            &times;
          </button>

          <h2 className="text-xl text-orange-400 font-bold pb-4 text-center">
            Where's Your Next Adventure?
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* Row 1: From & To */}
            <div className="flex gap-4 w-full">
              {["from", "to"].map((field, index) => (
                <div className="w-1/2" key={index}>
                  <label className="block font-semibold mb-1 pl-1">
                    {labels[field]}
                  </label>
                  <input
                    type="text"
                    name={field}
                    placeholder={placeholders[field]}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Row 2: Duration & Budget */}
            <div className="flex gap-4 w-full">
              {["duration", "budget"].map((field, index) => (
                <div className="w-1/2" key={index}>
                  <label className="block font-semibold mb-1 pl-1">
                    {labels[field]}
                  </label>
                  <input
                    type="number"
                    name={field}
                    placeholder={placeholders[field]}
                    value={formData[field]}
                    onChange={handleChange}
                    step={field === "budget" ? "1000" : undefined}
                    min="0"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Row 3: Date & Guests */}
            <div className="flex gap-4 w-full">
              {["date", "guests"].map((field, index) => (
                <div className="w-1/2" key={index}>
                  <label className="block font-semibold mb-1 pl-1">
                    {labels[field]}
                  </label>
                  <input
                    type={field === "date" ? "date" : "number"}
                    name={field}
                    placeholder={placeholders[field]}
                    value={formData[field]}
                    onChange={handleChange}
                    min={field === "date" ? new Date().toISOString().split("T")[0] : "0"}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="w-full">
              <button
                type="submit"
                className="bg-gradient-to-r from-[rgb(255,99,33)] to-amber-400 hover:scale-95 py-3 px-6 mt-2 text-white rounded-xl font-semibold w-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Form;
