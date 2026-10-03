import { Op, WhereOptions, InferAttributes } from "sequelize";
import { Bicycle } from "./bicycle.model";
import { Brand } from "../brands/brand.model";
import { BicycleDetail } from "../bicycle-details/bicycle-detail.model";


export type BicycleFilters = {
  text?: string;
  brand?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
};


export type PageOptions = {
  page: number;
  limit: number;
  sort: string;
  direction: "ASC" | "DESC";
};

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

  
  static async searchPaged(filters: BicycleFilters, options: PageOptions) {

    const where: any ={};

    
    if (filters.text) {
      where[Op.or] = [
        { model: { [Op.like]: `%${filters.text}%` } },
        { description: { [Op.like]: `%${filters.text}%` } },
      ];
    }

    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const price: Record<symbol, number> = {};
      if (filters.minPrice !== undefined) price[Op.gte] = filters.minPrice;
      if (filters.maxPrice !== undefined) price[Op.lte] = filters.maxPrice;
      where.price = price;
    }

    
    if (filters.inStock === true) {
      where.stock = { [Op.gt]: 0 };
    }

    
    const include: any[] = [];

    if (filters.brand) {
      include.push({
        model: Brand,
        as: "brand",
        where: { name: filters.brand },
        required: true,
      });
    }

    if (filters.material) {
      include.push({
        model: BicycleDetail,
        as: "detail",
        where: { frameMaterial: filters.material },
        required: true,
      });
    }

    
    const offset = (options.page - 1) * options.limit;

    
    const { rows, count } = await Bicycle.findAndCountAll({
      where,
      include,
      order: [[options.sort, options.direction]],
      limit: options.limit,
      offset,
      distinct: true, 
    });

    
    return {
      data: rows,
      meta: {
        page: options.page,
        limit: options.limit,
        totalItems: count,
        totalPages: Math.ceil(count / options.limit),
      },
    };
  }
}