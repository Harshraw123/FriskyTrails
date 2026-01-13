
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Activity } from "../models/activities.model.js";
import { sheetConfig } from "../config/sheetConfig.js";
import { pushToSheet } from "../utils/pushToSheet.js";

const activity = asyncHandler(async (req, res) => {
    const { activityType, location, date, description } = req.body;

    if (
        [activityType, location, date].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Activity Type, Location and Date are required");
    }

    const activity = new Activity({
        user: req.user?._id,
        email:req.user.email,
        activityType,
        location,
        date,
        description
    });
    
    const config = sheetConfig.Activities;

    await pushToSheet({
      sheetName: config.sheetName,
      columns: config.columns,
      document: activity,
    });



// ensure the activity is saved to the database
    await activity.save();
    return res.status(201).json(new ApiResponse(201, activity, "Activity created successfully"));
});

export { activity };
