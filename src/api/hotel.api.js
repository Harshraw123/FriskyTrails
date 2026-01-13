import axiosInstance from "../utils/axiosInstance";

const hotelBooking = async ({ city, property, checkInDate, checkOutDate, guests,budget }) => {
  try {
    const response = await axiosInstance.post("/api/v1/hotel/booking", { city, property, checkInDate, checkOutDate, guests,budget });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export { hotelBooking };
