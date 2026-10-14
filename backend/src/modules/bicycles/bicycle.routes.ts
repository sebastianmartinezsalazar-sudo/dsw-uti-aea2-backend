import { Router } from "express";
import { BicycleController } from "./bicycle.controller";

const router = Router();

router.get("/", BicycleController.getAll);
router.get("/price-above-100", BicycleController.findbyPriceAbove100);
router.get("/with-brand-and-model", BicycleController.findAllWithBrandAndModel);
router.get("/price-and-weigth", BicycleController.findByPriceAndWeigth);
router.get("/:id", BicycleController.getById);
router.post("/", BicycleController.create);
router.put("/:id", BicycleController.update);
router.delete("/:id", BicycleController.delete);



export default router;