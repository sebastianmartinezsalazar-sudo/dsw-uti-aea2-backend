import { Router } from "express";
import { BicycleDetailController } from "./bicycle-detail.controller";

const router = Router();

router.get("/", BicycleDetailController.getAll);
router.get("/:id", BicycleDetailController.getById);
router.get("/bicycle/:bicycleId", BicycleDetailController.getByBicycleId);
router.post("/", BicycleDetailController.create);
router.put("/:id", BicycleDetailController.update);
router.delete("/:id", BicycleDetailController.delete);

export default router;