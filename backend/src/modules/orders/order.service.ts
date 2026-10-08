import { Order } from "./order.model";
import { Customer } from "../customers/customer.model";
import { OrderItem } from "../order-items/order-item.model";
import { Bicycle } from "../bicycles/bicycle.model";
import { Brand } from "../brands/brand.model";

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

  // pedidos con bicicletas de una marca concreta

  static async findOrderWithBicyclesByBrand (brandName: string){
    return Order.findAll({
      include: [{model: Customer,as: "customer",},{model: OrderItem, as: "items", 
        required: true,
        include: [{model: Bicycle, as: "bicycle",
          include: [{model: Brand, as: "brand", 
            where: {name: brandName}, required: true,
          },],
        },],
       },
      ],
      order: [["orderDate", "DESC"]],
    });
  }
}