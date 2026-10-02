import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./customer.service";

export class CustomerController {

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const customers = await CustomerService.findAll();

      res.json(customers);
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

      const customer = await CustomerService.findById(id);

      if (!customer) {
        res.status(404).json({
          message: "Cliente no encontrado",
        });

        return;
      }

      res.json(customer);

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
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({
          message: "El name y el email son obligatorios",
        });

        return;
      }

      const customer = await CustomerService.create({
        name,
        email,
      });

      res.status(201).json(customer);

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

      const customer = await CustomerService.findById(id);

      if (!customer) {
        res.status(404).json({
          message: "Cliente no encontrado",
        });

        return;
      }

      const updatedCustomer = await CustomerService.update(
        customer,
        req.body
      );

      res.json(updatedCustomer);

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

      const customer = await CustomerService.findById(id);

      if (!customer) {
        res.status(404).json({
          message: "Cliente no encontrado",
        });

        return;
      }

      await CustomerService.delete(customer);

      res.status(204).send();

    } catch (error) {
      next(error);
    }
  }


  static async getCustomersByBrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const  brandName  = req.params.brandName as string;

      const customers = await CustomerService.findCustomersByBrand(brandName);

      res.json(customers);

    } catch (error) {
      next(error);
    }
  }
}