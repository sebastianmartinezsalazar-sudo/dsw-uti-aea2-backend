import { Router } from "express";
import { CustomerController } from "./customer.controller";

const router = Router();

router.get("/", CustomerController.getAll);
router.get("/:id", CustomerController.getById);
router.post("/", CustomerController.create);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.delete);
router.get("/by-brand/:brandName", CustomerController.getCustomersByBrand);

export default router;