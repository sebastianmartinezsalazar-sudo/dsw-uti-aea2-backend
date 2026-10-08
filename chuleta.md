📋 CHULETA DE EXAMEN - Sequelize Associations & Queries
🧠 Esqueleto Mental (SIGUE ESTOS PASOS)
¿Qué modelo principal uso? → Modelo.findAll()
¿Qué traigo asociado? → include: [{ model: OtroModelo, as: 'alias' }]
¿Necesito filtrar algo? → where: { ... }
¿Es obligatoria la relación? → required: true (INNER JOIN) o sin él (LEFT JOIN)
¿Necesito ordenar? → order: [['campo', 'ASC/DESC']]
🔑 Cláusulas Clave
Cláusula
Uso
Ejemplo
include
Traer tablas relacionadas
include: [{ model: Brand, as: 'brand' }]
as
Alias (debe coincidir con associations.ts)
as: 'orders'
where
Filtrar (WHERE de SQL)
where: { status: 'paid' }
required: true
INNER JOIN (solo si hay relación)
required: true dentro del include
Op.like
Búsqueda por patrón
{ [Op.like]: '%ibu%' }
order
Ordenar
order: [['orderDate', 'DESC']]
attributes
Elegir columnas específicas
attributes: ['id', 'name']
limit
Limitar resultados
limit: 10
offset
Paginación
offset: 20

📊 CONSULTAS ALEATORIAS DE EXAMEN
1. Relación 1:N - Brand ↔ Bicycle
Consulta: Todas las bicicletas de la marca "Trek"

import { Bicycle } from './bicycle.model';
import { Brand } from '../brands/brand.model';

static async findBicyclesByBrand(brandName: string) {
  return Bicycle.findAll({
    include: [{
      model: Brand,
      as: 'brand',
      where: { name: brandName },
      required: true
    }],
    order: [['price', 'ASC']]
  });
}


Consulta: Marcas con más de 5 bicicletas

import { Brand } from './brand.model';
import { Bicycle } from '../bicycles/bicycle.model';

static async findBrandsWithManyBicycles(minBicycles: number) {
  return Brand.findAll({
    include: [{
      model: Bicycle,
      as: 'bicycles'
    }],
    where: {
      // Filtro después del include (HAVING en SQL)
    },
    having: sequelize.where(
      sequelize.fn('COUNT', sequelize.col('bicycles.id')),
      { [Op.gte]: minBicycles }
    ),
    group: ['Brand.id']
  });
}

2. Relación 1:1 - Bicycle ↔ BicycleDetail
Consulta: Bicicletas con peso menor a 10kg

import { Bicycle } from './bicycle.model';
import { BicycleDetail } from '../bicycle-details/bicycle-detail.model';

static async findLightBicycles(maxWeight: number) {
  return Bicycle.findAll({
    include: [{
      model: BicycleDetail,
      as: 'detail',
      where: { weight: { [Op.lt]: maxWeight } },
      required: true
    }]
  });
}

Consulta: Todas las bicicletas con sus detalles (incluso si no tienen)
static async findAllBicyclesWithDetails() {
  return Bicycle.findAll({
    include: [{
      model: BicycleDetail,
      as: 'detail'
      // Sin required: true → LEFT JOIN
    }]
  });
}

3. Relación 1:N - Customer ↔ Order
Consulta: Pedidos de un cliente ordenados por fecha

import { Order } from './order.model';
import { Customer } from '../customers/customer.model';

static async findOrdersByCustomerId(customerId: number) {
  return Order.findAll({
    where: { customerId },
    include: [{ model: Customer, as: 'customer' }],
    order: [['orderDate', 'DESC']]
  });
}

Consulta: Clientes cuyo email contiene "gmail" y tienen pedidos

import { Customer } from './customer.model';
import { Order } from '../orders/order.model';
import { Op } from 'sequelize';

static async findGmailCustomersWithOrders() {
  return Customer.findAll({
    where: {
      email: { [Op.like]: '%gmail%' }
    },
    include: [{
      model: Order,
      as: 'orders',
      required: true
    }]
  });
}

4. Relación N:M - Order ↔ Bicycle (vía OrderItem)

Consulta: Pedidos con sus bicicletas y cantidades

import { Order } from './order.model';
import { OrderItem } from '../order-items/order-item.model';
import { Bicycle } from '../bicycles/bicycle.model';

static async findOrdersWithItems() {
  return Order.findAll({
    include: [{
      model: OrderItem,
      as: 'items',
      include: [{
        model: Bicycle,
        as: 'bicycle'
      }]
    }]
  });
}

Consulta: Pedidos que contienen bicicletas de marca "Trek"

import { Order } from './order.model';
import { OrderItem } from '../order-items/order-item.model';
import { Bicycle } from '../bicycles/bicycle.model';
import { Brand } from '../brands/brand.model';

static async findOrdersWithTrekBicycles() {
  return Order.findAll({
    include: [{
      model: OrderItem,
      as: 'items',
      include: [{
        model: Bicycle,
        as: 'bicycle',
        include: [{
          model: Brand,
          as: 'brand',
          where: { name: 'Trek' },
          required: true
        }]
      }],
      required: true
    }]
  });
}

5. Consultas Complejas (Nivel Examen)

Consulta: Total gastado por cliente

import { Customer } from './customer.model';
import { Order } from '../orders/order.model';
import { OrderItem } from '../order-items/order-item.model';
import { fn, col } from 'sequelize';

static async findCustomersWithTotalSpent() {
  return Customer.findAll({
    include: [{
      model: Order,
      as: 'orders',
      include: [{
        model: OrderItem,
        as: 'items',
        attributes: [
          [fn('SUM', col('items.quantity * items.unitPrice')), 'totalSpent']
        ]
      }]
    }]
  });
}

Consulta: Bicicletas más vendidas (top 10)

import { Bicycle } from './bicycle.model';
import { OrderItem } from '../order-items/order-item.model';
import { fn, col } from 'sequelize';

static async findTopSellingBicycles(limit: number = 10) {
  return Bicycle.findAll({
    include: [{
      model: OrderItem,
      as: 'orderItems',
      attributes: [
        [fn('SUM', col('orderItems.quantity')), 'totalSold']
      ]
    }],
    order: [[fn('SUM', col('orderItems.quantity')), 'DESC']],
    limit: limit,
    group: ['Bicycle.id']
  });
}

⚠️ ERRORES TÍPICOS EN EXAMEN
Alias incorrecto: El as en el include DEBE coincidir con associations.ts
Orden de rutas: /search/:param va ANTES que /:id
Typo en params: req.params.name_search debe coincidir con la ruta
required: true = INNER JOIN (solo si hay relación)
Sin required = LEFT JOIN (trae aunque no haya relación)
Olvidar Op: Importar import { Op } from 'sequelize' para usar Op.like, Op.gt, etc.

🎯 Plantilla Rápida para Cualquier Consulta

static async find[LoQueBusques]([parametros]) {
  return [ModeloPrincipal].findAll({
    where: { /* filtros del modelo principal */ },
    include: [{
      model: [ModeloRelacionado],
      as: 'alias',
      where: { /* filtros del relacionado */ },
      required: true, // o false
      include: [{ /* anidados si es N:M */ }]
    }],
    order: [['campo', 'ASC/DESC']],
    limit: 10,
    offset: 0
  });
}