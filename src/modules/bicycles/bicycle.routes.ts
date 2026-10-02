import { Router } from "express";
import { BicycleController } from "./bicycle.controller";

const router = Router();

router.get("/", BicycleController.getAll);
router.get("/:id", BicycleController.getById);
router.post("/", BicycleController.create);
router.put("/:id", BicycleController.update);
router.delete("/:id", BicycleController.delete);
router.get("/search", BicycleController.search);

export default router;