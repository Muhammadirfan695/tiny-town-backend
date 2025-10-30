
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Restaurant = sequelize.define(
    "Restaurant",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        opening_hours: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
        closing_hours: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
        contact_email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        cuisine_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        service_model: {
            type: DataTypes.JSON, 
            allowNull: true,
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: true, 
            references: {
                model: 'User',
                key: 'id'
            }
        },
     manager_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'User',
                key: 'id'
            }
        },
    }, 
    {
        timestamps: true,
        freezeTableName: true,
    }
);

module.exports = Restaurant;