import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { City } from "../models/city.model.js";
import { Country } from "../models/country.model.js";
import { State } from "../models/state.model.js";
import { CreateBlog } from "../models/create-blog.model.js";

export const createCity = asyncHandler(async (req, res) => {
  const { name, slug, country, state, howToReach } = req.body;

  if (!name || !slug || !country || !state) {
    throw new ApiError(400, "Name, slug, country and state are required");
  }

  const existingCountry = await Country.findById(country);
  if (!existingCountry) {
    throw new ApiError(404, "Country not found");
  }

  const existingState = await State.findById(state);
  if (!existingState) {
    throw new ApiError(404, "State not found");
  }

  let imageUrl = "";
  if (req.file) {
    const localPath = req.file.buffer;
    const uploadResult = await uploadOnCloudinary(localPath);
    if (!uploadResult) {
      throw new ApiError(500, "Image upload failed");
    }
    imageUrl = uploadResult.secure_url;
  }

  // check duplicate city in same state
  const existingCity = await City.findOne({ slug, state });
  if (existingCity) {
    throw new ApiError(400, "City with this name already exists in this state");
  }

  const newCity = await City.create({
    name,
    slug,
    country,
    state,
    image: imageUrl,
    howToReach,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newCity, "City created successfully"));
});

export const getCities = asyncHandler(async (req, res) => {
  const { stateId } = req.params;

  if (!stateId) {
    throw new ApiError(400, "State ID is required");
  }

  const cities = await City.find({ state: stateId }).select(
    "name slug _id image state country howToReach createdAt"
  );

  if (!cities.length) {
    throw new ApiError(404, "No cities found for this state");
  }

  res
    .status(200)
    .json(new ApiResponse(200, cities, "Cities fetched successfully"));
});

export const getCityWithBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const city = await City.findOne({ slug }).select(
    "name slug image state country howToReach"
  );
  if (!city) {
    throw new ApiError(404, "City not found");
  }

  const blogs = await CreateBlog.find({ city: city._id })
    .populate("country", "name slug")
    .populate("state", "name slug")
    .select("title slug coverImage content authorName state country createdAt");

  res
    .status(200)
    .json(
      new ApiResponse(200, { city, blogs }, "City with blogs fetched successfully")
    );
});

export const getCityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "City ID is required");
  }

  const city = await City.findById(id).select(
    "name slug image state country howToReach"
  );

  if (!city) {
    throw new ApiError(404, "City not found");
  }

  res.status(200).json(new ApiResponse(200, city, "City fetched successfully"));
});
