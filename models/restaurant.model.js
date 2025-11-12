
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
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
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
        total_weekly_hours: {
            type: DataTypes.FLOAT,
            allowNull: true,
            comment: "Total number of hours the restaurant is open per week",
        },
        contact_email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isUrl: true },
        },
        cuisine_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        service_model: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
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
        qr_normal: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        qr_light: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
    {
        timestamps: true,
        freezeTableName: true,
    }
);

module.exports = Restaurant;