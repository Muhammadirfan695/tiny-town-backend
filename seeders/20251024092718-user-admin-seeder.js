'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {

    const [existingUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "User" WHERE email = 'admin@example.com' LIMIT 1;`
    );

    if (existingUser.length > 0) {
      console.log('⚠️  Admin user already exists — skipping seeder.');
      return;
    }


    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Role" WHERE name = 'Admin' LIMIT 1;`
    );
    const adminRole = roles?.[0];

    if (!adminRole) {
      console.log('❌ Admin role not found — skipping seeder.');
      return;
    }


    const hashedPassword = await bcrypt.hash('Admin@123', 10);


    const [insertedUsers] = await queryInterface.bulkInsert(
      'User',
      [
        {
          id: uuidv4(),
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password: hashedPassword,
          status: 'active',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const adminUserId = insertedUsers?.id || insertedUsers?.[0]?.id;

    
    if (adminRole.id && adminUserId) {
      await queryInterface.bulkInsert('UserRole', [
        {
          id: uuidv4(),
          user_id: adminUserId,
          role_id: adminRole.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    console.log('✅ Admin user seeded successfully.');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRole', null, {});
    await queryInterface.bulkDelete('User', { email: 'admin@example.com' });
  },
};
