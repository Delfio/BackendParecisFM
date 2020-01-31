'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'programacaos',
      'programa_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'programas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('programacaos', 'programa_id');
  }
};
