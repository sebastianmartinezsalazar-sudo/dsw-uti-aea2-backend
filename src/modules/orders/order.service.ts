import { Order } from "./order.model";
import { Customer } from "../customers/customer.model";

export class OrderService {

  static async findAll() {
    return Order.findAll({
      order: [["id", "ASC"]],
    });
  }

  static async findById(id: number) {
    return Order.findByPk(id);
  }

  static async create(data : any) {
      return Order.create(data);
    }

  static async update(order: Order, data: any) {
    return order.update(data);
  }

  static async delete(order: Order) {
    await order.destroy();
  }

  // NUEVO: Buscar pedidos por customerId (Entrega 4)
  static async findByCustomerId(customerId: number) {
    return Order.findAll({
      where: { customerId },
      include: [{model: Customer,as: "customer",attributes:["id", "name", "email"]}],
      order: [["orderDate", "DESC"]],
    });
  }
}