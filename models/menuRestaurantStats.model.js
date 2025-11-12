const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MenuRestaurantStats = sequelize.define(
    "MenuRestaurantStats",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
       
        model_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        list: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        detail: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true, freezeTableName: true, indexes: [
            {
                unique: true,
                fields: ["model_id"], // unique together
            },
        ],
    }
);

module.exports = MenuRestaurantStats;
