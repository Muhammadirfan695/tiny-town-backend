const { UserRole, Role } = require("../models");

getUserRole = async (userId) => {
  const userRole = await UserRole.findOne({ where: { user_id: userId } });
  if (!userRole) return null;
  const role = await Role.findByPk(userRole.role_id);
  return role ? role.name : null;
};

exports.getRoleByName = async (name) => {
  if (!name) return null;
  return await Role.findOne({ where: { name } });
};

exports.assignRole = async (userId, roleId, transaction) => {

  return await UserRole.create({ user_id: userId, role_id: roleId }, { transaction });
};

module.exports = {
  getUserRole
}