'use strict';
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Grey Snoopy Summer Set',
        price: 'Rs. 1,500',
        image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500&q=80',
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Orange Basketball Outfit',
        price: 'Rs. 1,600',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80',
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};