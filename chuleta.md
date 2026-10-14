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


🚨 POSIBLES PREGUNTAS DE EXAMEN (Variaciones del Pre-Examen)
El profesor puede cambiar ligeramente los números o las condiciones. Aquí tienes las 4 variaciones más probables y cómo resolverlas.
🔹 Variación 1: "Devuelve todas las bicicletas de un MODELO concreto (ej: 'Domane') con su marca"
Es igual que el Apartado 2, pero el filtro va dentro del include del modelo.


import { Bicycle } from './bicycle.model';
import { Brand } from '../brands/brand.model';
import { Models } from '../models/model.model'; // O como hayas llamado a tu modelo
import { Op } from 'sequelize';

static async findBicyclesByModelName(modelName: string) {
  return Bicycle.findAll({
    include: [
      { model: Brand, as: 'brand' },
      { 
        model: Models, 
        as: 'bicycleModel',
        where: { 
          name: { [Op.like]: `%${modelName}%` } // Busca si el nombre contiene la palabra
        },
        required: true // Solo bicicletas que tengan ese modelo
      }
    ]
  });
}

Endpoint en Bruno: GET /api/bicycles/by-model/Domane


🔹 Variación 2: "Devuelve bicicletas con precio ENTRE 100 y 500"
En lugar de solo "mayor que", usamos un rango. Necesitamos Op.gte (mayor o igual) y Op.lte (menor o igual), o el súper poder Op.between.

import { Bicycle } from './bicycle.model';
import { Op } from 'sequelize';

static async findBicyclesInPriceRange(min: number, max: number) {
  return Bicycle.findAll({
    where: {
      price: { [Op.between]: [min, max] } // Traducción: WHERE price BETWEEN 100 AND 500
    },
    order: [['price', 'ASC']] // Bonus: ordenadas de la más barata a la más cara
  });
}

Endpoint en Bruno: GET /api/bicycles/price-range?min=100&max=500


🔹 Variación 3: "Devuelve los pedidos que contengan bicicletas de la marca 'Trek' Y del modelo 'Madone'"
Este es el "Jefe Final". Anidamos 3 niveles: Pedido → Item → Bicicleta → (Marca + Modelo).


import { Order } from './order.model';
import { OrderItem } from '../order-items/order-item.model';
import { Bicycle } from '../bicycles/bicycle.model';
import { Brand } from '../brands/brand.model';
import { Models } from '../models/model.model';

static async findOrdersWithTrekMadone() {
  return Order.findAll({
    include: [{
      model: OrderItem,
      as: 'items',
      required: true,
      include: [{
        model: Bicycle,
        as: 'bicycle',
        required: true,
        include: [
          { 
            model: Brand, 
            as: 'brand', 
            where: { name: 'Trek' }, 
            required: true 
          },
          { 
            model: Models, 
            as: 'bicycleModel', 
            where: { name: 'Madone' }, 
            required: true 
          }
        ]
      }]
    }]
  });
}

Endpoint en Bruno: GET /api/orders/trek-madone


 Variación 4: "Cuenta cuántas bicicletas hay de cada modelo"
A veces piden agrupar (group) y contar (COUNT).


import { Models } from './model.model';
import { Bicycle } from '../bicycles/bicycle.model';
import { fn, col } from 'sequelize';

static async countBicyclesPerModel() {
  return Models.findAll({
    attributes: [
      'name', // Queremos ver el nombre del modelo
      [fn('COUNT', col('bicycles.id')), 'totalBicycles'] // Y la cuenta de bicicletas
    ],
    include: [{
      model: Bicycle,
      as: 'bicycles',
      attributes: [] // No necesitamos los datos de la bici, solo contarlas
    }],
    group: ['Models.id', 'Models.name'] // Obligatorio cuando usas COUNT
  });
}

Endpoint en Bruno: GET /api/models/count-bicycles

🛡️ TRUCOS DE SUPERVIVENCIA PARA EL EXAMEN
¿Sequelize se queja de que no encuentra Op?
👉 Siempre pon arriba del todo: import { Op } from 'sequelize';
¿Te dice "Naming collision" o "Unknown column"?
👉 Revisa que el as: 'alias' en tu include sea IDÉNTICO al que pusiste en associations.ts.
¿La ruta te da error 404 o te devuelve la bici equivocada?
👉 Revisa el orden en routes.ts. Las rutas con nombres fijos (/price-range) van SIEMPRE ARRIBA de las rutas con parámetros (/:id).
¿Acabas de tocar associations.ts?
👉 ¡Para el servidor (Ctrl + C) y vuélvelo a arrancar (npm run dev) o no leerá los cambios!


🚀 COMANDOS GIT PARA SUBIR EL PRE-EXAMEN (OBLIGATORIO)
El PDF dice claramente: "Sube a Github una nueva rama llamada pre-examen con todo lo trabajado". Sigue estos pasos al pie de la letra:

# 1. Asegúrate de estar en la carpeta raíz del proyecto (donde está el .git)
cd .. 

# 2. Revisa que Git ve tus cambios (deberías ver los archivos de models, services, etc. en rojo/verde)
git status

# 3. Añade TODOS los archivos (incluyendo tus colecciones de Bruno en api-collection/)
git add -A

# 4. Guarda los cambios con un mensaje claro (los profesores miran esto)
git commit -m "Pre-examen UT1: CRUD Model + 4 custom queries (Brand, Model, Price, Weight)"

# 5. Crea la rama 'pre-examen' y muévete a ella
git checkout -b pre-examen

# 6. Sube la rama a GitHub por primera vez
git push -u origin pre-examen


📌 ¿El profesor también pide subir a develop y main?
Si te lo han pedido específicamente, ejecuta esto después del paso 6:


# Subir a develop
git checkout develop
git merge pre-examen
git push origin develop

# Subir a main
git checkout main
git merge pre-examen
git push origin main


✅ CHECKLIST FINAL ANTES DE ENTREGAR
¿El CRUD de Model funciona en Bruno (crear, leer, actualizar, borrar)?
¿La consulta de Bicicletas con Marca y Modelo devuelve 200 OK?
¿La consulta de Precio > 100 filtra correctamente?
¿La consulta de Pedidos con precio < 100 y peso > 20 funciona?
¿He subido la rama pre-examen a GitHub y puedo verla en la web?
¿Mis colecciones de Bruno están dentro de la carpeta api-collection/ en GitHub?
¡Si has marcado todo, tienes un 10 asegurado! 🎓🚀

📝 PASO A PASO DEL EXAMEN - Explicado


🎯 APARTADO 1: Crear el CRUD de "Model"
¿Qué es? Crear una ficha nueva llamada "Model" (como "Domane", "Madone") con sus 4 operaciones básicas.
PASO 1.1: Crea la carpeta
Ve a src/modules/
Crea una carpeta nueva llamada models/

PASO 1.2: Copia los 4 archivos de brands/
Ve a src/modules/brands/
Copia estos 4 archivos:
brand.model.ts
brand.service.ts
brand.controller.ts
brand.routes.ts
Pégalos en tu nueva carpeta models/
Cámbiales el nombre a:
model.model.ts
model.service.ts
model.controller.ts
model.routes.ts

PASO 1.3: Cambia los nombres DENTRO de cada archivo
En CADA archivo, busca y reemplaza:
Donde diga Brand → pon Model
Donde diga BrandService → pon ModelService
Donde diga BrandController → pon ModelController
Donde diga brands → pon models
Donde diga /brands → pon /models
PASO 1.4: Registra el modelo
Abre src/server.ts
Añade al principio: import { Model } from "./modules/models/model.model";
Abre src/models/associations.ts
Añade la asociación (verás que ya la tienes hecha)
Abre src/routes/index.ts
Añade: import modelRoutes from "../modules/models/model.routes";
Añade: router.use("/models", modelRoutes);

PASO 1.5: Prueba en Bruno
Crea una carpeta models en Bruno y prueba:
GET http://localhost:3000/api/models → debe mostrar una lista vacía
POST http://localhost:3000/api/models con body: {"name": "Domane"} → debe crear uno


🎯 APARTADO 2: Bicicletas con marca y modelo
¿Qué es? Devolver bicicletas con DOS cosas pegadas: su marca y su modelo.
PASO 2.1: Abre bicycle.service.ts
Ve a src/modules/bicycles/bicycle.service.ts
PASO 2.2: Añade este método al final de la clase (antes de la última llave })


static async findAllWithBrandAndModel() {
  return Bicycle.findAll({
    include: [
      { model: Brand, as: "brand" },
      { model: Model, as: "bicycleModel" }
    ]
  });
}


PASO 2.3: Abre bicycle.controller.ts
Añade al final de la clase:

static async findAllWithBrandAndModel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bicycles = await BicycleService.findAllWithBrandAndModel();
    res.json(bicycles);
  } catch (error) {
    next(error);
  }
}

PASO 2.4: Abre bicycle.routes.ts
Añade esta línea ANTES de la línea que dice router.get("/:id", ...):

router.get("/with-brand-and-model", BicycleController.findAllWithBrandAndModel);

🎯 APARTADO 3: Bicicletas con precio mayor de 100
¿Qué es? Filtrar bicicletas caras (precio > 100).
PASO 3.1: Abre bicycle.service.ts
Añade al final de la clase:

static async findByPriceAbove100() {
  return Bicycle.findAll({
    where: {
      price: { [Op.gt]: 100 }
    }
  });
}

PASO 3.2: Abre bicycle.controller.ts
Añade al final de la clase:

static async findByPriceAbove100(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bicycles = await BicycleService.findByPriceAbove100();
    res.json(bicycles);
  } catch (error) {
    next(error);
  }
}

router.get("/price-above-100", BicycleController.findByPriceAbove100);


PASO 3.4: Prueba en Bruno
GET http://localhost:3000/api/bicycles/price-above-100


🎯 APARTADO 4: Pedidos con bicicletas baratas y pesadas

¿Qué es? Devolver pedidos que tengan bicicletas con precio < 100 Y peso > 20.
PASO 4.1: Abre order.service.ts
Ve a src/modules/orders/order.service.ts
PASO 4.2: Añade al final de la clase:

static async findOrdersWithCheapHeavyBicycles() {
  return Order.findAll({
    include: [{
      model: OrderItem,
      as: "items",
      required: true,
      include: [{
        model: Bicycle,
        as: "bicycle",
        where: {
          price: { [Op.lt]: 100 },
          weight: { [Op.gt]: 20 }
        },
        required: true
      }]
    }]
  });
}


PASO 4.3: Abre order.controller.ts
Añade al final de la clase:

static async findOrdersWithCheapHeavyBicycles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await OrderService.findOrdersWithCheapHeavyBicycles();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

PASO 4.4: Abre order.routes.ts
Añade ANTES de /:id:

router.get("/cheap-heavy-bicycles", OrderController.findOrdersWithCheapHeavyBicycles);


PASO 4.5: Prueba en Bruno
GET http://localhost:3000/api/orders/cheap-heavy-bicycles


⚠️ COSAS IMPORTANTES QUE NO PUEDES OLVIDAR
Reinicia el servidor después de tocar associations.ts:
Ctrl + C para parar
npm run dev para arrancar
Importa Op en los archivos que lo usen:

   import { Op } from "sequelize";


   Las rutas van en orden: Las específicas (/with-brand-and-model) van ANTES que las genéricas (/:id)
El as debe coincidir: Lo que pongas en associations.ts debe ser IGUAL a lo que pongas en el include


✅ CHECKLIST FINAL
Marca cada cosa cuando funcione:
CRUD de Model funciona en Bruno
Bicicletas con marca y modelo (200 OK)
Bicicletas precio > 100 (200 OK)
Pedidos con bicicletas precio < 100 y peso > 20 (200 OK)
Rama pre-examen subida a GitHub
**¡Si marcas todo, tienes el 100%! **
