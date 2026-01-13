import { Flight } from "../models/flights.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

const flight = asyncHandler(async (req, res) => {
  const {
    fromCity,
    toCity,
    departureDate,
    returnDate,
    travelClass,
    passengers,
    price,
    airline,
  } = req.body;

  if (
    [fromCity, toCity, departureDate, travelClass, passengers].some(
      (field) =>
        field === undefined ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  // Normalize travelClass
  const normalizeTravelClass = (value) => {
    if (!value) return value;
    const v = value.toString().trim().toLowerCase();
    if (["first", "first class", "first_class", "first-class"].includes(v))
      return "First Class";
    if (["business", "business class", "business_class", "business-class"].includes(v))
      return "Business";
    if (["premium economy", "premium", "premium_economy", "premium-economy"].includes(v))
      return "Premium Economy";
    if (["economy", "eco", "econ"].includes(v)) return "Economy";
    return value;
  };

  const normalizedTravelClass = normalizeTravelClass(travelClass);
  const allowedClasses = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];

  if (!allowedClasses.includes(normalizedTravelClass)) {
    throw new ApiError(400, `Invalid travel class: ${travelClass}`);
  }

  // ✅ Save to DB
  const flightDoc = await Flight.create({
    user: req.user._id,
    email: req.user.email,
    fromCity,
    toCity,
    departureDate,
    returnDate,
    travelClass: normalizedTravelClass,
    passengers,
    price,
    airline,
  });

  //  PUSH TO GOOGLE SHEET (GENERIC)
  const config = sheetConfig.Flight;

  await pushToSheet({
    sheetName: config.sheetName,
    columns: config.columns,
    document: flightDoc,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, flightDoc, "Flight booking created successfully"));
});

export { flight };
