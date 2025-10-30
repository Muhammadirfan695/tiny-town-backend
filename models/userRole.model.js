const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserRole = sequelize.define(
    "UserRole",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        tableName: "UserRole",
    }
);

module.exports = UserRole;
