'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn(
      'radios',
      'link',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('radios', 'link');
  }
};
