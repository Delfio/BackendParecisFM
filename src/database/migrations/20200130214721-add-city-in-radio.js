'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'radios',
      'cidade_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'cidades', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('radios', 'cidade_id');

  }
};
