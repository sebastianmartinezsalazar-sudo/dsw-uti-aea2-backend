import { Request, Response, NextFunction } from "express";
import { BicycleService } from "./bicycle.service";

export class BicycleController {

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bicycles = await BicycleService.findAll();

      res.json(bicycles);
    } catch (error) {
      next(error);
    }
  }


  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
  res.status(400).json({ message: "Invalid ID" });
  return;
      }

      const bicycle = await BicycleService.findById(id);

      if (!bicycle) {
        res.status(404).json({
          message: "Bicycle not found",
        });

        return;
      }

      res.json(bicycle);

    } catch (error) {
      next(error);
    }
  }


  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { brandId, model, description, price, stock } = req.body;

      if (!brandId || !model || price === undefined) {
        res.status(400).json({
          message: "brandId, model and price are required",
        });

        return;
      }

      const bicycle = await BicycleService.create({
        brandId,
        model,
        description,
        price,
        stock,
      });

      res.status(201).json(bicycle);

    } catch (error) {
      next(error);
    }
  }


  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
  res.status(400).json({ message: "Invalid ID" });
  return;
      }

      const bicycle = await BicycleService.findById(id);

      if (!bicycle) {
        res.status(404).json({
          message: "Bicycle not found",
        });

        return;
      }

      const updatedBicycle = await BicycleService.update(
        bicycle,
        req.body
      );

      res.json(updatedBicycle);

    } catch (error) {
      next(error);
    }
  }


  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
  res.status(400).json({ message: "Invalid ID" });
  return;
      }

      const bicycle = await BicycleService.findById(id);

      if (!bicycle) {
        res.status(404).json({
          message: "Bicycle not found",
        });

        return;
      }

      await BicycleService.delete(bicycle);

      res.status(204).send();

    } catch (error) {
      next(error);
    }
  }
    static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = {
        text: typeof req.query.text === "string" ? req.query.text.trim() : undefined,
        brand: typeof req.query.brand === "string" ? req.query.brand.trim() : undefined,
        material: typeof req.query.material === "string" ? req.query.material : undefined,
        minPrice: req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined,
        inStock: req.query.inStock === "true",
      };

      if (filters.minPrice !== undefined && isNaN(filters.minPrice)) {
        res.status(400).json({ message: "minPrice must be a number" });
        return;
      }
      if (filters.maxPrice !== undefined && isNaN(filters.maxPrice)) {
        res.status(400).json({ message: "maxPrice must be a number" });
        return;
      }
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
        res.status(400).json({ message: "minPrice cannot exceed maxPrice" });
        return;
      }

      const allowedSort = new Set(["price", "model", "stock", "createdAt", "id"]);
      const sort = typeof req.query.sort === "string" && allowedSort.has(req.query.sort) ? req.query.sort : "id";
      const direction = req.query.direction === "desc" ? "DESC" : "ASC";
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

      const result = await BicycleService.searchPaged(filters, { page, limit, sort, direction });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}