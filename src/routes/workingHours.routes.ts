import { Router } from "express";
import { Request, Response } from "express";

import { QueryWorkingHours } from "#types/types.js";

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: "Working hours API" });
});

export default router;