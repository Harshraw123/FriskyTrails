import { RailTicket } from "../models/railTicket.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

const railTicket = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { fromStation, toStation, departureDate, returnDate, travelClass, passengers, price } = req.body;
    if (
        [fromStation, toStation, departureDate, travelClass, passengers].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Required fields are missing");
    }
    const railTicket = new RailTicket({
        user: req.user._id,
       email: req.user.email,
        fromStation,
        toStation,
        departureDate,
        returnDate,
        travelClass,
        passengers,
        price
    });
      //  PUSH TO GOOGLE SHEET (GENERIC)
    const config = sheetConfig.RailTicket;

    await pushToSheet({
      sheetName: config.sheetName,
      columns: config.columns,
      document: railTicket,
    });
  

    await railTicket.save();
    return res.status(201).json(new ApiResponse(201, railTicket, "Rail ticket booked successfully"));
});

export { railTicket };
