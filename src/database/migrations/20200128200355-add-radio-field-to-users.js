'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn(
      'users',
      'radio_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'radios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );

  },

  down: (queryInterface) => {

    return queryInterface.removeColumn('users', 'radio_id');

  }
};
