import { Bicycle } from "./bicycle.model";

export class BicycleService {

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
    }
  ) {
    return bicycle.update(data);
  }


  static async delete(bicycle: Bicycle) {
    await bicycle.destroy();
  }

  static async search(filters: {
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    model?: string;
  }) {
    const where: any = {};

    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.$lte = filters.maxPrice;
    }
    if (filters.model) where.model = { [require('sequelize').Op.like]: `%${filters.model}%` };

    return Bicycle.findAll({ where });
  }
}