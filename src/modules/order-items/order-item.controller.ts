import { Request, Response, NextFunction } from "express";
import { OrderItemService } from "./order-item.service";

export class OrderItemController {
  
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await OrderItemService.findAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await OrderItemService.findById(id);
      if (!item) {
        res.status(404).json({ message: "Order item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, bicycleId, quantity, unitPrice } = req.body;
      if (!orderId || !bicycleId || !quantity || !unitPrice) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const item = await OrderItemService.create({ orderId, bicycleId, quantity, unitPrice });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await OrderItemService.findById(id);
      if (!item) {
        res.status(404).json({ message: "Order item not found" });
        return;
      }
      const updated = await OrderItemService.update(item, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await OrderItemService.findById(id);
      if (!item) {
        res.status(404).json({ message: "Order item not found" });
        return;
      }
      await OrderItemService.delete(item);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}