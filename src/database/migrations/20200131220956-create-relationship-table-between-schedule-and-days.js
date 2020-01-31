'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'programacaos',
      'dia_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'dias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('programacaos', 'dia_id');
  }
};
