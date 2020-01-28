'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('banners', { id: Sequelize.INTEGER });

  },

  down: (queryInterface) => {
    return queryInterface.dropTable('banners');

  }
};
