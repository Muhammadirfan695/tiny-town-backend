const { UserRole, Role } = require("../models");

const getUserRole = async (userId) => {
  const userRole = await UserRole.findOne({ where: { user_id: userId } });
  if (!userRole) return null;
  const role = await Role.findByPk(userRole.role_id);
  return role ? role.name : null;
};
const getAllUserRolesById = async (userId) => {
  const userRoles = await UserRole.findAll({ where: { user_id: userId } });

  if (!userRoles || userRoles.length === 0) return [];
  const roleIds = userRoles.map((ur) => ur.role_id);
  const roles = await Role.findAll({
    where: { id: roleIds },
    attributes: ["id", "name"], 
  });

  return roles.map((role) => role.name);
};
const getRoleByName = async (name) => {
  if (!name) return null;
  return await Role.findOne({ where: { name } });
};

const assignRole = async (userId, roleId, transaction) => {

  return await UserRole.create({ user_id: userId, role_id: roleId }, { transaction });
};

const getAllRoleByIds = async (roles, transaction) => {
  return await Role.findAll({
    where: { id: roles },
    transaction,
  });
};

const removeUserRole = async (userId, roleIds = null, transaction = null) => {
  const where = { user_id: userId };
  if (roleIds) {
    where.role_id = Array.isArray(roleIds) ? roleIds : [roleIds];
  }
  const deletedCount = await UserRole.destroy({
    where,
    transaction,
  });

  return deletedCount;
};

module.exports = {
  getUserRole,
  assignRole,
  getRoleByName,
  getAllRoleByIds,
  removeUserRole,
  getAllUserRolesById
}