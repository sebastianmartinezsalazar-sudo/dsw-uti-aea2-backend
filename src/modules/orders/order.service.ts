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

    static async create(data: {
        customerId: number;
        orderDate?: Date;
        status?: "pending" | "paid" | "shipped" | "cancelled";
    }) {
        return Order.create(data);
    }

    static async update(order: Order, data: {
        customerId?: number;
        orderDate?: Date;
        status?: "pending" | "paid" | "shipped" | "cancelled";
    }){
        return order.update(data);
    }

    static async delete(order: Order) {
        await order.destroy();
    }

    // Consulta 6.3: Pedidos con bicicletas de una marca
    static async findOrdersByBrand(brandName: string) {
        return Order.findAll({
            include: [
                {
                    model: Customer,
                    as: "customer",
                    attributes: ["id", "name"],
                },
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
        });
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