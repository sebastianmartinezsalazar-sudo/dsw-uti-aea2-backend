import { Customer } from "./customer.model";
import { Order } from "../orders/order.model";
import { OrderItem } from "../order-items/order-item.model";
import { Bicycle } from "../bicycles/bicycle.model";
import { Brand } from "../brands/brand.model";

export class CustomerService {

  static async findAll() {
    return Customer.findAll({
      order: [["id", "ASC"]],
    });
  }

  static async findById(id: number) {
    return Customer.findByPk(id);
  }

  static async create(data: {
    name: string;
    email: string;
  }) {
    return Customer.create(data);
  }

  static async update(customer: Customer, data: {
    name?: string;
    email?: string;
  }): Promise<Customer> {
    await customer.update(data);
    return customer;
  }

  static async delete(customer: Customer) {
    await customer.destroy();
  }

  // Consulta 6.4: Clientes que compraron una marca
  static async findCustomersByBrand(brandName: string) {
    return Customer.findAll({
      include: [
        {
          model: Order,
          as: "orders",
          required: true,
          include: [
            {
              model: OrderItem,
              as: "items",
              required: true,
              include: [
                {
                  model: Bicycle,
                  as: "bicycle",
                  required: true,
                  include: [
                    {
                      model: Brand,
                      as: "brand",
                      where: { name: brandName },
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      distinct: true,
    } as any);
  }
}