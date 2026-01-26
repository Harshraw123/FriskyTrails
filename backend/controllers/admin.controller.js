import { Country } from "../models/country.model.js";
import { CreateBlog } from "../models/create-blog.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { State } from "../models/state.model.js";
import { City } from "../models/city.model.js";
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      slug,
      authorName,
      country,
      state,
      city,
      blocks,
      intro,
      conclusion,
      faq,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !slug ||
      !authorName ||
      !country ||
      !blocks ||
      !intro ||
      !conclusion ||
      !faq
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse blocks if sent as string (form-data)
    let parsedBlocks = blocks;
    if (typeof blocks === "string") {
      try {
        parsedBlocks = JSON.parse(blocks);
      } catch (err) {
        return res.status(400).json({ message: "Invalid blocks format" });
      }
    }

    if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one content block is required" });
    }

    // Handle optional cover image upload
    let coverImageUrl = "";
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer);
      coverImageUrl = uploadResult?.secure_url || "";
    }

    // Normalize blocks
    const updatedBlocks = parsedBlocks.map((block, idx) => ({
      order: Number(block.order) || idx + 1, // fallback: use array index
      heading: block.heading || "",
      content: block.content || "",
      image: block.image || "",
    }));

    const cleanObjectId = (value) => (value ? value : undefined);
    // Create blog
    const newBlog = await CreateBlog.create({
      title,
      slug,
      intro,
      conclusion,
      authorName,
      country,
      state: cleanObjectId(state),
      city: cleanObjectId(city),
      faq,
      coverImage: coverImageUrl,
      blocks: updatedBlocks,
    });

    res.status(201).json({
      status: true,
      data: newBlog,
      message: "✅ Blog created successfully",
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    console.log("hello")
    const blogs = await CreateBlog.find()
  .populate("country", "name _id")
  .populate("state", "name _id")
  .populate("city", "name _id")
  .sort({ createdAt: -1 })
  .select("title slug authorName coverImage country state city intro createdAt")
  .lean();

  console.log("blogs", blogs)
    // Handle empty case
    if (!blogs || blogs.length === 0) {
      return res.status(200).json({  
        status: true,
        count: 0,
        data: [],
        message: "No blogs yet",
      });
    }

    // Return response
    res.status(200).json({
      status: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

const createCountry = asyncHandler(async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    let imageUrl = "";

    if (req.file) {
      const localPath = req.file.buffer;
      const uploadResult = await uploadOnCloudinary(localPath);
      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadResult.secure_url;
    }

    const newCountry = await Country.create({
      name,
      slug,
      image: imageUrl,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newCountry, "Country created successfully"));
  } catch (error) {
    console.error("Error creating country:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getCountries = asyncHandler(async (req, res) => {
  try {
    const countries = await Country.find().select("name slug image createdAt");

    res
      .status(200)
      .json(new ApiResponse(200, countries, "Countries fetched successfully"));
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getCountryBySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw new ApiError(400, "Slug is required");
    }

    const country = await Country.findOne({ slug }).select(
      "name slug image createdAt"
    );

    if (!country) {
      throw new ApiError(404, "Country not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, country, "Country fetched successfully"));
  } catch (error) {
    console.error("Error fetching country by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getCountryWithBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const country = await Country.findOne({ slug }).select("name slug image");
  if (!country) {
    throw new ApiError(404, "Country not found");
  }

  const blogs = await CreateBlog.find({ country: country._id })
    .populate("state", "name slug")
    .populate("city", "name slug")
    .select("title slug coverImage  content authorName state city createdAt");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { country, blogs },
        "Country with blogs fetched successfully"
      )
    );
});

export const getPublicBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await CreateBlog.find()
      .sort({ createdAt: -1 })
      .select("title slug authorName coverImage country state city intro createdAt")
      .lean();

    return res.status(200).json({ status: true, count: blogs.length, data: blogs });
  } catch (err) {
    console.error("Error fetching public blogs:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug)
      return res
        .status(400)
        .json({ status: false, message: "Slug parameter is required" });

    const blog = await CreateBlog.findOne({ slug })
      .populate("country state city", "name _id slug")
  .select("-__v")

    if (!blog)
      return res.status(404).json({ status: false, message: "Blog not found" });

    if (blog.blocks && blog.blocks.length > 0) {
      blog.blocks.sort((a, b) => a.order - b.order);
    }

    res
      .status(200)
      .json({ status: true, data: blog, message: "Blog fetched successfully" });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
const getBlogById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
  console.log("Fetching blog with ID:", id);


    const blog = await CreateBlog.findById(id)
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    // Transform for frontend
    const frontendBlog = {
      id: blog._id,
      title: blog.title,
      slug: blog.slug,
      intro: blog.intro,
      conclusion: blog.conclusion,
      authorName: blog.authorName,
      country: blog.country?.name || "",
      state: blog.state?.name || "",
      city: blog.city?.name || "",
      faq: blog.faq || "",
      coverImage: blog.coverImage,
      blocks: blog.blocks.map((block) => ({
        id: block._id || block.id,
        order: block.order,
        heading: block.heading,
        content: block.content,
        image: block.image || "",
      })),
    };

    res.status(200).json({ status: true, data: frontendBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Upload single image from rich text editor
const uploadEditorImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "No file uploaded" });
    }
    const uploadResult = await uploadOnCloudinary(req.file.buffer);
    if (!uploadResult?.secure_url) {
      return res
        .status(500)
        .json({ status: false, message: "Image upload failed" });
    }
    return res.status(201).json({ status: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error("Editor image upload error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      intro,
      conclusion,
      authorName,
      country,
      state,
      city,
      faq,
      blocks,
    } = req.body;

    const blog = await CreateBlog.findById(id);
    if (!blog)
      return res.status(404).json({ status: false, message: "Blog not found" });

    // Update cover image if new file
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer);
      blog.coverImage = uploadResult?.secure_url || blog.coverImage;
    }

    // Update fields
    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.intro = intro || blog.intro;
    blog.conclusion = conclusion || blog.conclusion;
    blog.authorName = authorName || blog.authorName;
    blog.country = country || blog.country;
    blog.state = state || blog.state;
    blog.faq = faq || blog.faq;
    blog.city = city || blog.city;

    // Update blocks
    if (blocks) {
      let parsedBlocks = blocks;
      if (typeof blocks === "string") parsedBlocks = JSON.parse(blocks);

      blog.blocks = parsedBlocks.map((block, idx) => ({
        order: Number(block.order) || idx + 1,
        heading: block.heading || "",
        content: block.content || "",
        image: block.image || "",
        id: block.id || Date.now(),
      }));
    }

    await blog.save();

    res
      .status(200)
      .json({ status: true, data: blog, message: "Blog updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await CreateBlog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: true,
      data: blog,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
});


// controllers/stateController.ts (ya .js)
// path apne hisaab se change karein

 const getAllStates = async (req, res) => {
  try {
    const states = await State.find({})
      .populate("country") // agar country ka pura data chahiye
      .sort({ createdAt: -1 }); // latest first, optional

    return res.status(200).json({
      success: true,
      count: states.length,
      data: states,
    });
  } catch (error) {
    console.error("Error in getAllStates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch states",
    });
  }
};



const getStateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "State ID is required",
      });
    }

    const state = await State.findById(id)
      .populate("country", "_id name slug");

    if (!state) {
      return res.status(404).json({
        status: false,
        message: "State not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: state,
    });
  } catch (error) {
    console.error("Get state by ID error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch state",
    });
  }
};

const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find()
      .select("_id name slug image")
      .sort({ name: 1 });

    return res.status(200).json({
      status: true,
      data: countries,
    });
  } catch (error) {
    console.error("getAllCountries error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch countries",
    });
  }
};
 const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid country ID",
      });
    }

    const country = await Country.findById(id);

    if (!country) {
      return res.status(404).json({
        status: false,
        message: "Country not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: country,
    });
  } catch (error) {
    console.error("getCountryById error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch country",
    });
  }
};


const updateState = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid state ID",
      });
    }

    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({
        status: false,
        message: "State not found",
      });
    }

    // 🔹 text fields
    state.name = req.body.name || state.name;
    state.slug = req.body.slug || state.slug;
    state.description = req.body.description || state.description;
    state.country = req.body.country || state.country;

    // 🔹 image (optional) - using Cloudinary
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer);
      state.image = uploadResult?.secure_url || state.image;
    }

    await state.save();

    return res.status(200).json({
      status: true,
      message: "State updated successfully",
      data: state,
    });
  } catch (error) {
    console.error("updateState error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update state",
    });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid country ID",
      });
    }

    const country = await Country.findById(id);

    if (!country) {
      return res.status(404).json({
        status: false,
        message: "Country not found",
      });
    }

    // 🔹 text fields
    country.name = req.body.name || country.name;
    country.slug = req.body.slug || country.slug;

    // 🔹 image (optional) - using Cloudinary
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer);
      country.image = uploadResult?.secure_url || country.image;
    }

    await country.save();

    return res.status(200).json({
      status: true,
      message: "Country updated successfully",
      data: country,
    });
  } catch (error) {
    console.error("updateCountry error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update country",
    });
  }
};

// ==================== CITIES CONTROLLERS ====================

const getAllCities = async (req, res) => {
  try {
    const cities = await City.find({})
      .populate("country", "_id name slug")
      .populate("state", "_id name slug")
      .sort({ createdAt: -1 }); // latest first, optional

    return res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error("Error in getAllCities:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};

const getCityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "City ID is required",
      });
    }

    const city = await City.findById(id)
      .populate("country", "_id name slug")
      .populate("state", "_id name slug");

    if (!city) {
      return res.status(404).json({
        status: false,
        message: "City not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: city,
    });
  } catch (error) {
    console.error("Get city by ID error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch city",
    });
  }
};

const updateCity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid city ID",
      });
    }

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({
        status: false,
        message: "City not found",
      });
    }

    // 🔹 text fields
    city.name = req.body.name || city.name;
    city.slug = req.body.slug || city.slug;
    city.howToReach = req.body.howToReach || city.howToReach;
    city.country = req.body.country || city.country;
    city.state = req.body.state || city.state;

    // 🔹 image (optional) - using Cloudinary
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer);
      city.image = uploadResult?.secure_url || city.image;
    }

    await city.save();

    return res.status(200).json({
      status: true,
      message: "City updated successfully",
      data: city,
    });
  } catch (error) {
    console.error("updateCity error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update city",
    });
  }
};


export {
  updateState,
  updateCountry,
  createBlog,
  updateBlog,
  deleteBlog,
  createCountry,
  getCountryWithBlogs,
  getCountries,
  getBlogBySlug,
  uploadEditorImage,
  getAllBlogs,
  getBlogById,
  //harsh

  getAllStates,
  getCountryById,
  getAllCountries,
  getStateById,
  //cities
  getAllCities,
  getCityById,
  updateCity,
};
