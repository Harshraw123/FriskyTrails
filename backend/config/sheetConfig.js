export const sheetConfig = {

  // Sheet headers = same order as columns

  User: {
    sheetName: "Users",
    columns: [
      "_id",      // Maps to user_id in sheet
      "email",
      "userName", // Maps to user_name in sheet
      "name",
      "avatar",
      "isVerified", // Maps to is_verified in sheet
      "isAdmin",    // Maps to is_admin in sheet
      "createdAt",  // Maps to created_at in sheet
      "updatedAt"   // Maps to update_at in sheet
    ]
  },

  Flight: {
    sheetName: "Flights",
    columns: [
      "_id",
      "user",
      "fromCity",
      "toCity",
      "departureDate",
      "returnDate",
      "travelClass",
      "passengers",
      "price",
      "airline",
      "bookingReference",
      "createdAt",
      'email',
    ]
  },

  HotelBooking: {
    sheetName: "HotelBookings",
    columns: [
      "_id",
      "user",
      "city",
      "budget",
      "checkInDate",
      "checkOutDate",
      "guests",
          "property",
      "bookingReference",
      "createdAt",
      'email',
  
    ]
  },

  RailTicket: {
    sheetName: "RailTickets",
    columns: [
      "user",
      "fromStation",
      "toStation",
      "departureDate",
      "returnDate",
      "travelClass",
      "passengers",
      // "price",
      "bookingReference",
      "createdAt",
      'email',
    ]
  },

  BusTicket: {
    sheetName: "BusTickets",
    columns: [
      "user",
      "fromCity",
      "toCity",
      "departureDate",
      "returnDate",
      "passengers",
      // "price",
      "bookingReference",
      "createdAt",
      'email',
    ]
  },

Transport: {
    sheetName: "TransportForms",  //Transport  
    columns: [
      "user",
      "fromLocation",
      "toLocation",
      "duration",
      "transportType",
      "date",
      // "price",
      // "bookingReference",
      "createdAt",
      'email',
    ]
  },
 Activities: {
    sheetName: "ActivitiesForm",
    columns: [
      "user",
      "activityType",
      "location",
      "date",
      // "description",
      'createdAt',
      'email'
    ]
  },
Holidays: {
    sheetName: "HolidayForms",    //Adventure wala hai yeah
    columns: [
      "user",
      "fromCity",
      "toCity",
      "duration",
      "budget",
      "date",
      "guests",
     "createdAt",
     'email',
    ]
  },
Contact: {
    sheetName: "ContactForms",    //Adventure wala hai yeah
    columns: [
     'name',
     'email',
     'mobile',
     'message',
    ]
  }



};
