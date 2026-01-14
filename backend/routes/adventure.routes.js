import { Router } from "express";
import { adventure } from "../controllers/adventure.controller.js";
import { flight } from "../controllers/flight.controller.js";
import { railTicket } from "../controllers/railTicket.controller.js";
import { busTicket } from "../controllers/busTicket.controller.js";
import { hotelBooking } from "../controllers/hotel.controller.js";

import { activity } from "../controllers/activities.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { transport } from "../controllers/transport.contoller.js";

const router = Router();

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply JWT verification and error handling to all routes
const protectedRoute = (handler) => [
  verifyJWT,
  asyncHandler(handler)
];

// Define routes with error handling
router.route("/adventure/booking").post(...protectedRoute(adventure));
router.route("/flight/booking").post(...protectedRoute(flight));
router.route("/rail/booking").post(...protectedRoute(railTicket));
router.route("/bus/booking").post(...protectedRoute(busTicket));
router.route("/hotel/booking").post(...protectedRoute(hotelBooking));
router.route("/transport/booking").post(...protectedRoute(transport));

router.route("/activity").post(...protectedRoute(activity));

// 404 handler for undefined routes under /api/v1
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler for this router
router.use((err, req, res, next) => {
  console.error('Adventure Routes Error:', {
    url: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

export default router;