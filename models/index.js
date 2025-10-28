const { sequelize } = require("../config/db");

const User = require("./userModel");
const Role = require("./roleModel");
const Country = require("./countryModel");
const City = require('./cityModel');
const UserRole = require("./userRoleModel");
const Attachment = require("./attachmentModel");
const Restaurant = require("./restaurantModel");
const ManagerRestaurant = require("./managerRestaurantModel");


User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "Roles",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "Users",
});


Attachment.belongsTo(User, {
  foreignKey: "model_id",
  constraints: false,
  as: "userAttachment",
  scope: { model_type: "User" },
});

User.hasMany(Attachment, {
  foreignKey: "model_id",
  constraints: false,
  scope: { model_type: "User" },
  as: "attachments",
});

User.hasMany(Restaurant, { foreignKey: 'owner_id', as: 'OwnedRestaurants' });
Restaurant.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });

User.hasMany(Restaurant, { foreignKey: 'manager_id', as: 'ManagedRestaurants' });
Restaurant.belongsTo(User, { as: 'Manager', foreignKey: 'manager_id' })
Restaurant.hasMany(Attachment, {
  foreignKey: "model_id",
  constraints: false,
  scope: { model_type: "Restaurant" },
  as: "attachments", 
});

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Country,
  City,
  Attachment,
    Restaurant,         
  // ManagerRestaurant 
};
