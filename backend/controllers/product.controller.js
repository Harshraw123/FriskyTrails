import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

console.log("Controller loaded");

// ============================
// Create Product
// ============================
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    productType,
    rating,
    reviews,
    offerPrice,
    actualPrice,
    description,
    productHighlights,
    productOverview,
    itineraries, // 👈 ADDED
    thingsToCarry,
    additionalInfo,
    faq,
    country,
    state,
    city,
    packages,
  } = req.body;

  if (!name || !slug || !productType || !offerPrice || !actualPrice) {
    throw new ApiError(
      400,
      "Name, Slug, Product Type, Offer Price, and Actual Price are required"
    );
  }

  // Upload images to Cloudinary
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.buffer);
      if (result?.secure_url) images.push(result.secure_url);
    }
    if (images.length > 5)
      throw new ApiError(400, "You can upload up to 5 images only");
  }

  // Parse packages safely
  let parsedPackages = [];
  if (packages) {
    try {
      parsedPackages = JSON.parse(packages);
    } catch (err) {
      throw new ApiError(400, "Invalid packages format");
    }
  }

  // Helper: clean optional ObjectId fields
  const cleanObjectId = (value) => (value ? value : undefined);

  const product = await Product.create({
    name,
    slug,
    productType,
    rating: rating || 0,
    reviews: reviews || 0,
    offerPrice,
    actualPrice,
    description,
    productHighlights,
    productOverview,
    itineraries, // 👈 SAVED
    thingsToCarry,
    additionalInfo,
    faq,
    images,
    packages: parsedPackages,
    country,
    state: cleanObjectId(state),
    city: cleanObjectId(city),
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "✅ Product created successfully"));
});

// ============================
// Get All Products
// ============================
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("country state city", "name slug")
    .select(
      "name slug productType rating reviews offerPrice actualPrice images city packages createdAt"
    );

  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ============================
// Get Product By Slug
// ============================
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .populate("country state city productType", "name slug")
    .select("-__v"); // 👈 Now includes itineraries automatically

  if (!product) throw new ApiError(404, "Product not found");

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ============================
// Get Product By ID
// ============================
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id)
    .populate("country", "name slug")
    .populate("state", "name slug")
    .populate("city", "name slug")
    .populate("productType", "name slug")
    .select("-__v") // 👈 Now includes itineraries automatically
    .lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ============================
// Update Product By Slug
// ============================
export const updateProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const {
    name,
    offerPrice,
    actualPrice,
    productType,
    rating,
    reviews,
    description,
    productHighlights,
    productOverview,
    itineraries, // 👈 ADDED
    thingsToCarry,
    additionalInfo,
    faq,
    country,
    state,
    city,
    packages,
  } = req.body;

  const product = await Product.findOne({ slug });
  if (!product) throw new ApiError(404, "Product not found");

  // Upload new images
  if (req.files?.length) {
    if (req.files.length + product.images.length > 5) {
      throw new ApiError(400, "You can upload up to 5 images only");
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.buffer);
      if (result?.secure_url) uploadedImages.push(result.secure_url);
    }

    product.images = [...product.images, ...uploadedImages];
  }

  // Update fields
  if (name) {
    product.name = name;
    product.slug = slugify(name, { lower: true, strict: true });
  }
  if (offerPrice) product.offerPrice = offerPrice;
  if (actualPrice) product.actualPrice = actualPrice;
  if (productType) product.productType = productType;
  if (rating !== undefined) product.rating = rating;
  if (reviews !== undefined) product.reviews = reviews;
  if (description) product.description = description;
  if (productHighlights) product.productHighlights = productHighlights;
  if (productOverview) product.productOverview = productOverview;
  if (itineraries) product.itineraries = itineraries; // 👈 UPDATED
  if (thingsToCarry) product.thingsToCarry = thingsToCarry;
  if (additionalInfo) product.additionalInfo = additionalInfo;
  if (faq) product.faq = faq;
  if (country) product.country = country;
  if (state) product.state = state;
  if (city) product.city = city;

  // Update packages
  if (packages) {
    try {
      product.packages = JSON.parse(packages);
    } catch (err) {
      throw new ApiError(400, "Invalid packages format");
    }
  }

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// ============================
// Delete Product
// ============================
export const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOneAndDelete({ slug });
  if (!product) throw new ApiError(404, "Product not found");

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});
