import { Contact } from "../models/contact.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sheetConfig } from "../config/sheetConfig.js";
import { pushToSheet } from "../utils/pushToSheet.js";

const contactclient = asyncHandler(async (req, res) => {
    const {name, mobile, email, message} = req.body;
    // console.log(req.body)
    if(
        [name, email, message].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    if(!/^[a-zA-Z\s]+$/.test(name)){
        throw new ApiError(400, "Name can only contain letters and spaces");
    }
    const contact = new Contact({
        name,
        mobile,
        email,
        message
    });
    const config = sheetConfig.Contact;

    await pushToSheet({
      sheetName: config.sheetName,
      columns: config.columns,
      document: contact,
    });


    await contact.save();
    return res.status(201).json(
        new ApiResponse(201, contact, "Our team will contact you soon")
    );
});

export { contactclient };