import { BicycleDetail } from "./bicycle-detail.model";
import { Bicycle } from "../bicycles/bicycle.model";

export class BicycleDetailService {
  static async findAll() {
    return BicycleDetail.findAll({ order: [["id", "ASC"]] });
  }

  static async findById(id: number) {
    return BicycleDetail.findByPk(id);
  }

  static async findByBicycleId(bicycleId: number) {
    return BicycleDetail.findOne({ where: { bicycleId } });
  }

  static async create(data: {
    bicycleId: number;
    frameMaterial: "Aluminum" | "Carbon" | "Steel" | "Titanium";
    wheelSize: number;
    weight: number;
    suspension?: string;
  }) {
    const bicycle = await Bicycle.findByPk(data.bicycleId);
    if (!bicycle) throw new Error("Bicycle not found");

    const existing = await BicycleDetail.findOne({
      where: { bicycleId: data.bicycleId },
    });
    if (existing) throw new Error("Bicycle already has a detail record");

    return BicycleDetail.create(data);
  }

  static async update(detail: BicycleDetail, data: Partial<BicycleDetail>) {
    await detail.update(data);
    return detail;
  }

  static async delete(detail: BicycleDetail) {
    await detail.destroy();
  }
}