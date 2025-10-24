const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Country = sequelize.define(
    "Country",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: true, freezeTableName: true, }
);

module.exports = Country;
