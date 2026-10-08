import { Request, Response, NextFunction } from "express";
import { BicycleDetailService } from "./bicycle-detail.service";

export class BicycleDetailController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const details = await BicycleDetailService.findAll();
      res.json(details);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const detail = await BicycleDetailService.findById(id);

      if (!detail) {
        res.status(404).json({ message: "Detail not found" });
        return;
      }

      res.json(detail);
    } catch (error) {
      next(error);
    }
  }

  static async getByBicycleId(req: Request, res: Response, next: NextFunction) {
    try {
      const bicycleId = Number(req.params.bicycleId);
      const detail = await BicycleDetailService.findByBicycleId(bicycleId);

      if (!detail) {
        res.status(404).json({ message: "Detail not found for this bicycle" });
        return;
      }

      res.json(detail);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { bicycleId, frameMaterial, wheelSize, weight, suspension } = req.body;

      if (!bicycleId || !frameMaterial || !wheelSize || !weight) {
        res.status(400).json({ message: "bicycleId, frameMaterial, wheelSize and weight are required" });
        return;
      }

      const detail = await BicycleDetailService.create({
        bicycleId,
        frameMaterial,
        wheelSize,
        weight,
        suspension,
      });

      res.status(201).json(detail);
    } catch (error: any) {
      res.status(409).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const detail = await BicycleDetailService.findById(id);

      if (!detail) {
        res.status(404).json({ message: "Detail not found" });
        return;
      }

      const updated = await BicycleDetailService.update(detail, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const detail = await BicycleDetailService.findById(id);

      if (!detail) {
        res.status(404).json({ message: "Detail not found" });
        return;
      }

      await BicycleDetailService.delete(detail);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}