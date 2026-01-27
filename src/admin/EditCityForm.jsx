import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import { getCurrentUser } from "../api/user.api";
import {
  getAllCountries,
  getStates,
  getCityById,
  updateCity,
} from "../api/admin.api";
import Editor from "../components/Editor";

const EditCityForm = ({ cityId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    howToReach: "",
    country: "",
    state: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);

  /* ---------------- ADMIN CHECK ---------------- */
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await getCurrentUser();
        const user = res.data.user;
        if (!user || !user.admin) setIsAllowed(false);
        else setIsAdmin(true);
      } catch {
        setIsAllowed(false);
      }
    };
    checkAdmin();
  }, []);

  /* ---------------- FETCH COUNTRIES ---------------- */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getAllCountries();
        setCountries(res.data?.data || res.data || []);
      } catch (err) {
        setCountries([]);
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  /* ---------------- FETCH CITY ---------------- */
  useEffect(() => {
    const fetchCity = async () => {
      if (!cityId) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await getCityById(cityId);
        const city = res.data?.data || res.data;

        if (city) {
          setFormData({
            name: city.name || "",
            slug: city.slug || "",
            howToReach: city.howToReach || "",
            country: city.country?._id || city.country || "",
            state: city.state?._id || city.state || "",
          });
          setImagePreview(city.image || "");
        }
      } catch (err) {
        setMessage("Failed to load city data");
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [cityId]);

  /* ---------------- FETCH STATES (Preserve fetched state value) ---------------- */
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) {
        setStates([]);
        return;
      }
      try {
        const res = await getStates(formData.country);
        const statesData = res.data?.data || res.data || [];
        setStates(statesData);
        
        // Only reset state if current state isn't valid for this country
        const hasValidState = formData.state && statesData.some(s => s._id === formData.state);
        if (!hasValidState) {
          setFormData(prev => ({ ...prev, state: "" }));
        }
      } catch (err) {
        setStates([]);
      }
    };
    fetchStates();
  }, [formData.country]);

  /* ---------------- INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }

    // Reset state only when country changes
    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  };

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ---------------- SUBMIT - FIXED SCROLL + SUCCESS ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 Save scroll position before submit
    const scrollContainer = window;
    const scrollX = scrollContainer.scrollX;
    const scrollY = scrollContainer.scrollY;
    
    setSubmitting(true);
    setMessage("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("howToReach", formData.howToReach);
    data.append("country", formData.country);
    data.append("state", formData.state);
    if (imageFile) data.append("image", imageFile);

    try {
      const res = await updateCity(cityId, data);
      
      // 🔥 Show success message first
      setMessage(res.message || "City updated successfully! ✅");
      
      // 🔥 Update parent list with new data (no full re-render)
      if (onUpdate) {
        onUpdate({
          _id: cityId,
          ...formData,
          image: imagePreview
        });
      }
      
      // 🔥 Restore exact scroll position
      setTimeout(() => {
        scrollContainer.scrollTo(scrollX, scrollY);
      }, 100);
      
      // 🔥 Auto-close after 2 seconds (user sees success)
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      setMessage(err.message || "Failed to update city ❌");
      
      // Restore scroll on error too
      setTimeout(() => {
        scrollContainer.scrollTo(scrollX, scrollY);
      }, 100);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- GUARDS ---------------- */
  if (loading || countriesLoading) return <div>Loading...</div>;
  if (!isAllowed) return <NotFound />;
  if (!isAdmin) return null;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 w-full max-w-xl sm:max-w-2xl md:w-[70%] mt-10 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit City</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-2 border rounded"
          placeholder="City name"
        />

        {/* Slug */}
        <input
          type="text"
          name="slug"
          value={formData.slug}
          disabled
          className="p-2 border text-gray-400 rounded cursor-not-allowed"
        />

        {/* Country */}
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* State */}
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          disabled={!formData.country || !states.length}
          className="p-2 border rounded"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* How to Reach - Editor */}
        <div>
          <label className="block font-semibold mb-2">How to Reach</label>
          <Editor 
            content={formData.howToReach} 
            onChange={(val) => setFormData(prev => ({ ...prev, howToReach: val }))} 
          />
        </div>

        {/* Image */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="City"
            className="w-full h-48 object-cover rounded"
          />
        )}

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="p-2 border rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition ${
            submitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {submitting ? "Updating..." : "Update City"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg text-center font-medium text-sm sm:text-base ${
            message.includes("Failed") || message.includes("❌")
              ? "bg-red-50 text-red-700 border-2 border-red-200"
              : "bg-green-50 text-green-700 border-2 border-green-200 animate-pulse"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default EditCityForm;

