import { Bicycle } from '../modules/bicycles/bicycle.model';
import { Brand } from '../modules/brands/brand.model';
import { Customer } from '../modules/customers/customer.model';
import { Order } from '../modules/orders/order.model';
import { OrderItem } from '../modules/order-items/order-item.model';
import { BicycleDetail } from '../modules/bicycle-details/bicycle-detail.model';
export function defineAssociations() {
  // 1:N Brand - Bicycle
  Brand.hasMany(Bicycle, { foreignKey: 'brandId', as: 'bicycles' });
  Bicycle.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

  // 1:N Customer - Order
  Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
  Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

  // N:M Order - Bicycle a través de OrderItem
  

  // Relaciones de la tabla intermedia
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  Bicycle.hasMany(OrderItem, { foreignKey: 'bicycleId', as: 'orderItems' });
  OrderItem.belongsTo(Bicycle, { foreignKey: 'bicycleId', as: 'bicycle' });

  Bicycle.hasOne(BicycleDetail, { foreignKey: "bicycleId", as: "detail", onDelete: "CASCADE" });
  BicycleDetail.belongsTo(Bicycle, { foreignKey: "bicycleId", as: "bicycle" });
}