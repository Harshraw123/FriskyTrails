import { HotelBooking } from "../models/hotelBooking.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

const hotelBooking = asyncHandler(async (req, res) => {
    const { city, property, checkInDate, checkOutDate, guests, budget } = req.body;

    if (
        [city, property, checkInDate, checkOutDate, guests, budget].some(
            (field) => field === undefined || (typeof field === "string" && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Required fields are missing");
    }

    const hotelBooking = new HotelBooking({
        user: req.user._id,
        email: req.user.email,
        city,
        property,
        checkInDate,
        checkOutDate,
        guests,
        budget,
    });

      //  PUSH TO GOOGLE SHEET (GENERIC)
    const config = sheetConfig.HotelBooking;

  await pushToSheet({
    sheetName: config.sheetName,
    columns: config.columns,
    document: hotelBooking,
  });


    await hotelBooking.save();

    return res.status(201).json(
        new ApiResponse(201, hotelBooking, "Hotel booking created successfully")
    );
});


export { hotelBooking };
