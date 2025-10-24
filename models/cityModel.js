const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Country = require("./countryModel");

const City = sequelize.define(
    "City",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        country_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Country, 
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        }
    },
    { timestamps: true, freezeTableName: true, }
);

module.exports = City;
