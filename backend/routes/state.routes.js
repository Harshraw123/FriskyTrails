import { Router } from "express"
import { createState,  getStates, getStateWithBlogs } from "../controllers/state.controller.js"

const router = Router()

router.post("/create", createState)

// router.get("/country/:countryId", getStates)

router.get("/:slug", getStateWithBlogs)

export default router
