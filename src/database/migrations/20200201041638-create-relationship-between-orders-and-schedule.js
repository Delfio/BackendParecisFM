'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pedidos',
      'programacao_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'programacaos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('pedidos', 'programacao_id');
  }
};
