import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

export class OrderItem extends Model<
InferAttributes<OrderItem>,
InferCreationAttributes<OrderItem>
> {
    declare id: CreationOptional<number>;
    declare orderId: number;
    declare bicycleId: number;
    declare quantity: number;
    declare unitPrice: number;
}

OrderItem.init(
   {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    bicycleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {min: 1},
    },
    unitPrice: {
        type: DataTypes.DECIMAL (10, 2),
        allowNull: false,
        validate: { min: 0},
    },
   },
   {
    sequelize,
    tableName: 'order_items',
    modelName: 'OrderItem',
    indexes:[
        {
            unique: true,
            fields: ['orderId', 'bicycleId'],
        },
    ],
   }

);