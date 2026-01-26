import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { State } from "../models/state.model.js";
import { Country } from "../models/country.model.js";
import { ApiError } from "../utils/apiError.js";
import { CreateBlog } from "../models/create-blog.model.js";

export const createState = asyncHandler(async (req, res) => {
  try {
    const { name, slug, country } = req.body;

    if (!name || !slug || !country) {
      return res.status(400).json({ message: "Name, slug and country are required" });
    }

    const existingCountry = await Country.findById(country);
    if (!existingCountry) {
      return res.status(404).json({ message: "Country not found" });
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

    // Check duplicate state by slug in same country
    const existingState = await State.findOne({ slug, country });
    if (existingState) {
      return res.status(400).json({ message: "State already exists in this country" });
    }

    const newState = await State.create({
      name,
      slug,
      country,
      image: imageUrl,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newState, "State created successfully"));
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export const getStates = asyncHandler(async (req, res) => {
  const { countryId } = req.params;

  if (!countryId) {
    throw new ApiError(400, "Country ID is required");
  }

  const states = await State.find({ country: countryId }).select(
    "name slug _id image country createdAt"
  );

  if (!states.length) {
    throw new ApiError(404, "No states found for this country");
  }

  res
    .status(200)
    .json(new ApiResponse(200, states, "States fetched successfully"));
});

export const getStateWithBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const state = await State.findOne({ slug }).select("name slug image country");
  if (!state) {
    throw new ApiError(404, "State not found");
  }

  const blogs = await CreateBlog.find({ state: state._id })
    .populate("country", "name slug")
    .populate("city", "name slug")
    .select("title slug coverImage content authorName country city createdAt");

  res.status(200).json(
    new ApiResponse(200, { state, blogs }, "State with blogs fetched successfully")
  );
});