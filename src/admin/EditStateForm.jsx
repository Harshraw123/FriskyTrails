import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import NotFound from "../components/NotFound";
import { getCurrentUser } from "../api/user.api";
import { getAllCountries, getStateById, updateState } from "../api/admin.api";

const EditStateForm = ({ stateId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",   
    country: "",
  });

  const [countries, setCountries] = useState([]);
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
        const countriesData = res.data?.data || res.data || [];
        setCountries(countriesData);
      } catch (err) {
        setCountries([]);
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  /* ---------------- FETCH STATE ---------------- */
  useEffect(() => {
    const fetchState = async () => {
      if (!stateId) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await getStateById(stateId);
        console.log('State response:', res);
        
        const stateData = res?.data || res;

        if (stateData) {
          setFormData({
            name: stateData.name || "",
            slug: stateData.slug || "",
            description: stateData.description || "",
            country: stateData.country?._id || stateData.country || "",
          });

          setImagePreview(stateData.image || "");
        }
      } catch (err) {
        setMessage("Failed to load state data");
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, [stateId]);

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
    data.append("description", formData.description);
    data.append("country", formData.country);
    if (imageFile) data.append("image", imageFile);

    try {
      const res = await updateState(stateId, data);
      
      // 🔥 Show success message first
      setMessage(res.message || "State updated successfully! ✅");
      
      // 🔥 Update parent list with new data (no full re-render)
      if (onUpdate) {
        onUpdate({
          _id: stateId,
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
      setMessage(err.message || "Failed to update state ❌");
      
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
      <h2 className="text-xl font-bold mb-4">Edit State</h2>
  
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
          placeholder="State name"
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
          {countries &&
            countries.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>

        {/* 🔥 Editor for Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <Editor 
            content={formData.description} 
            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))} 
          />
        </div>
  
        {/* Image */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="State"
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
          {submitting ? "Updating..." : "Update State"}
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

export default EditStateForm;
