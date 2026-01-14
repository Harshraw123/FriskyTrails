import { Transport } from "../models/transport.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

const transport = asyncHandler(async (req, res) => {
    const { fromLocation, toLocation, duration, transportType, date, price } = req.body;
    if (
        [fromLocation, toLocation, duration, transportType, date].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Required fields are missing");
    }
    const transport = new Transport({
        user: req.user._id,
        email: req.user._id,
        fromLocation,
        toLocation,
        duration,
        transportType,
        date,
        price
    });

    const config = sheetConfig.Transport;

    await pushToSheet({
      sheetName: config.sheetName,
      columns: config.columns,
      document: transport,
    });
    await transport.save();
    return res.status(201).json(new ApiResponse(201, transport, "Transport booking created successfully"));
});

export { transport };
