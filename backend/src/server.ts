import { app } from "./app";
import { sequelize } from "./config/database";
import { env } from "./config/env";
import { defineAssociations } from "./models/associations.ts";

// Importamos los modelos para que Sequelize los registre.
import "./modules/bicycles/bicycle.model.ts";
import "./modules/brands/brand.model.ts";
import "./modules/customers/customer.model.ts";
import "./modules/orders/order.model.ts";
import "./modules/order-items/order-item.model.ts";
import "./modules/models/model.model.ts"

async function startServer() {
  try {

    defineAssociations();

    await sequelize.authenticate();

    console.log("Conexión con MySQL establecida.");

    //await sequelize.sync();

    await sequelize.sync({force: true});

    console.log("Modelos sincronizados.");

    app.listen(env.PORT, () => {
      console.log(
        `Servidor funcionando en http://localhost:${env.PORT}`
      );
    });

  } catch (error) {

    console.error(
      "No se pudo iniciar la aplicación:",
      error
    );

    process.exit(1);
  }
}

startServer();