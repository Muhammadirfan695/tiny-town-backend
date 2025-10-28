
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db");

// const ManagerRestaurant = sequelize.define(
//     "ManagerRestaurant",
//     {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true,
//         },
//         user_id: { 
//             type: DataTypes.UUID,
//             allowNull: false,
//             references: {
//                 model: 'User',
//                 key: 'id'
//             }
//         },
//         restaurant_id: { 
//             type: DataTypes.UUID,
//             allowNull: false,
//             references: {
//                 model: 'Restaurant',
//                 key: 'id'
//             }
//         },
//     },
//     {
//         timestamps: true,
//         freezeTableName: true,
//     }
// );

// module.exports = ManagerRestaurant;