import { OrderItem } from "./order-item.model";

export class OrderItemService {
  static async findAll() {
    return OrderItem.findAll({ order: [["id", "ASC"]] });
  }

  static async findById(id: number) {
    return OrderItem.findByPk(id);
  }

  static async create(data: any) {
    return OrderItem.create(data);
  }

  static async update(item: OrderItem, data: any) {
    return item.update(data);
  }

  static async delete(item: OrderItem) {
    await item.destroy();
  }
}