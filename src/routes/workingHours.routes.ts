import { Router } from "express";
import { Request, Response } from "express";

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: "Working hours API" });
});

export default router;