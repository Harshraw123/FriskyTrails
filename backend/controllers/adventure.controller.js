import { Adventure } from "../models/adventure.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

const adventure = asyncHandler(async (req, res) => {
  const { fromCity, toCity, duration, budget, date, guests } = req.body;
  const missingField = [
    fromCity,
    toCity,
    duration,
    budget,
    date,
    guests,
  ].some(
    (field) =>
      field === undefined ||
      field === null ||
      (typeof field === "string" && field.trim() === "")
  );

  if (missingField) {
    throw new ApiError(400, "All fields are required");
  }

  // Parse / validate date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid date provided");
  }

  // Coerce numeric values where appropriate
  const parsedBudget = Number(budget);
  const parsedGuests = Number(guests);
  if (Number.isNaN(parsedBudget) || Number.isNaN(parsedGuests)) {
    throw new ApiError(
      400,
      "Budget and guests must be valid numbers"
    );
  }

  // Ensure user and email exist (route is protected, but add safety check)
  if (!req.user || !req.user.email) {
    throw new ApiError(401, "User authentication required");
  }

  const adventureDoc = new Adventure({
    user: req.user._id,
    email: req.user.email,
    fromCity: String(fromCity).trim(),
    toCity: String(toCity).trim(),
    duration: String(duration).trim(),
    budget: parsedBudget,
    date: parsedDate,
    guests: parsedGuests,
  });

  //  PUSH TO GOOGLE SHEET (GENERIC) - Holidays sheet
  const config = sheetConfig.Holidays;

  await pushToSheet({
    sheetName: config.sheetName,
    columns: config.columns,
    document: adventureDoc,
  });

  await adventureDoc.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        adventureDoc,
        "Adventure information taken successfully"
      )
    );
});

export { adventure };