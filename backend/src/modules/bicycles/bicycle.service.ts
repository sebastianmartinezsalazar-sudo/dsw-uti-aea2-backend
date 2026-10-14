import { Bicycle } from "./bicycle.model.ts";
import { Models } from "../models/model.model.ts";
import {Brand} from "../brands/brand.model.ts";
import { Op } from "sequelize";

export class BicycleService {

  static async findByPriceAbove100(){
    return Bicycle.findAll({
      where: {
        price: {[Op.gt]: 100 }
      }
    });
  }

  static async findByPriceAndWeigth(){
    return Bicycle.findAll({
      where:{
        price: {[Op.lt]: 100},
        weigth: {[Op.gt]: 20}
      }
    })
  }


  static async findAllWithBrandAndModel(){
    return Bicycle.findAll({
      include: [
        {model: Brand, as: "brand"},
        {model: Models, as: "bicycleModel"}
      ]
    });
  }

  static async findAll() {
    return Bicycle.findAll({
      order: [["id", "ASC"]],
    });
  }

  static async findById(id: number) {
    return Bicycle.findByPk(id);
  }

  static async create(data: {
    brandId: number;
    model: string;
    description?: string | null;
    price: number;
    stock: number;
    weigth: number;
  }) {
    return Bicycle.create(data);
  }

  static async update(
    bicycle: Bicycle,
    data: {
      brandId?: number;
      model?: string;
      description?: string | null;
      price?: number;
      stock?: number;
      weigth?: number;
    }
  ) {
    return bicycle.update(data);
  }

  static async delete(bicycle: Bicycle) {
    await bicycle.destroy();
  }
}