import { Router } from "express";
import bicycleRoutes from "../modules/bicycles/bicycle.routes";
import brandRoutes from "../modules/brands/brand.routes";
import orderRoutes from "../modules/orders/order.routes";
import customerRoutes from "../modules/customers/customer.routes";
import orderItemRoutes from "../modules/order-items/order-item.routes";
import bicycleDetailRoutes from "../modules/bicycle-details/bicycle-detail.routes";
const router = Router();

router.use("/bicycles", bicycleRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/order-items", orderItemRoutes);
router.use("/bicycle-details", bicycleDetailRoutes);

export default router;