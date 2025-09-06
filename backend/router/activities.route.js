import express from "express";
import {
  allActivities,
  detail,
  filterbyCity,
} from "../controllers/event.controller.js"; // Importing the controller function

const router = express.Router();

router.get("/", allActivities);
router.get("/city/events", filterbyCity); // Assuming filterbyCity is defined in the controller
router.get("/event/:id", detail);

export default router;
