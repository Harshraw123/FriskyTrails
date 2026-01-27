import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { createBlog, createCountry, getAllBlogs, getAllCountries, getAllStates, getBlogById, getCountries, getCountryBySlug, getCountryById, getCountryWithBlogs, updateBlog, deleteBlog, updateState, updateCountry, uploadEditorImage, getAllCities, getCityById, updateCity, getStateById } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createState, getStates, getStateWithBlogs } from "../controllers/state.controller.js";
import { createCity, getCities, getCityWithBlogs } from "../controllers/city.controller.js";
import { createProduct, deleteProduct, getProductById, getProductBySlug, getProducts, updateProduct } from "../controllers/product.controller.js";
import { createBooking, getAllBookings, getBookingsByProduct } from "../controllers/booking.controller.js";
import { createProductType, getAllProductTypes, getProductTypeById, getProductTypeBySlug, getProductTypeBySlugWithProduct } from "../controllers/productType.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
const router = Router();
console.log("🔥 LOADED:", import.meta.url);


console.log("🔥 ROUTER FILE EXECUTED");

router.route("/create-blog").post(upload.single("image"), verifyJWT, verifyAdmin, createBlog)
console.log("Router file loaded");
router.get("/blogs", (req, res, next) => {
  console.log("Route matched, going to next");
  next();
}, getAllBlogs);
router.route("/blog/:id").get(verifyJWT, verifyAdmin, getBlogById);
router.put("/blog/:id", upload.single("image"), verifyJWT, verifyAdmin, updateBlog);
router.delete("/blog/:id", verifyJWT, verifyAdmin, deleteBlog);

router.post("/upload-editor-image", upload.single("image"), verifyJWT, verifyAdmin, uploadEditorImage);
router.post("/create-country", upload.single("image"), verifyJWT, verifyAdmin, createCountry);
router.get("/country/:slug", verifyJWT, getCountries);
router.post("/create-state", upload.single("image"), verifyJWT, verifyAdmin, createState);
router.get("/countries", verifyJWT, getCountries);
router.get("/states/:countryId", verifyJWT, getStates);
router.post("/create-city", upload.single("image"), verifyJWT, verifyAdmin, createCity);
router.get("/cities/:stateId", verifyJWT, getCities);
router.get("/country/:slug", verifyJWT, getCountryBySlug);
router.get("/country/:slug/blogs", getCountryWithBlogs);
router.get("/state/:slug/blogs", getStateWithBlogs);
router.get("/city/:slug/blogs", getCityWithBlogs);

//HARSH ROUTES----------------------

// ================= STATES ROUTES =================

router.get(
  "/states",
  (req, res, next) => {
    console.log(" state Route matched, going to next");
    next();
  },
  getAllStates
);

router.get(
  "/state/:id",
  verifyJWT,
  verifyAdmin, 
  getStateById
);

// ================= COUNTRIES ROUTES =================

router.get(
  "/allcountries",
  verifyJWT,
  verifyAdmin, 
  getAllCountries
);

router.get(
  "/country/:id",
  verifyJWT,
  verifyAdmin, 
  getCountryById
);

router.put(
  "/country/:id",
  verifyJWT,
  verifyAdmin, 
  upload.single("image"),
  updateCountry
);

router.put(
  "/state/:id",
  verifyJWT,
  verifyAdmin, 
  upload.single("image"),
  updateState
);

// ==========  CITIES ROUTES ============

router.get(
  "/cities",
  (req, res, next) => {
    console.log("Cities route matched, going to next");
    next();
  },
  getAllCities
);

router.get(
  "/city/:id",
  getCityById
);

router.put(
  "/city/:id",
  verifyJWT,
  verifyAdmin, 
  upload.single("image"),
  updateCity
);





router.post(
  "/create-product",
  verifyJWT,
  verifyAdmin,
  upload.array("images", 5),
  createProduct
);

router.get("/products", getProducts);
router.route("/product/id/:id").get(getProductById);
router.get("/product/slug/:slug", getProductBySlug);
router.put("/product/:slug", upload.array("images", 5), updateProduct, verifyJWT, verifyAdmin);
router.delete("/product/:slug", deleteProduct);

router.post("/bookings", verifyJWT, verifyAdmin, createBooking);
router.get("/bookings", verifyJWT, verifyAdmin, getAllBookings);
router.get("/bookings/:slug", verifyJWT, verifyAdmin, getBookingsByProduct);

router.post("/create-productType", upload.single("image"), verifyJWT, verifyAdmin, createProductType);
router.get("/productTypes/:slug", getProductTypeBySlug);
router.get("/productTypes/:slug/product", getProductTypeBySlugWithProduct);
router.get("/productType/:id", getProductTypeById);
router.get("/all-productTypes", getAllProductTypes);


export default router;
