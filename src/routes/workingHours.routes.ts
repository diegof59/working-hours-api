import { Router } from "express";
import { getWorkingHours } from "#controllers/workingHours.controller.js";

const router: Router = Router();

// GET /api/v1/working-hours/
router.get('/', getWorkingHours);

export default router;