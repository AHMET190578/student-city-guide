import express from "express";
import {
  allLocation,
  onecity,
  info,
  addComment,
  findByCategory,
  getTopRatedPlaces,
} from "../controllers/location.controller.js"; // Adjust the path as necessary

const router = express.Router();

router.get("/top-rated", getTopRatedPlaces);
// router.get("/category/:category", findByCategory);
router.get("/sehir/:id", info);
router.post("/sehir/:id", addComment);
router.get("/", allLocation);

router.get("/:cityName", onecity);
export default router;
