'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'cidades',
      'estado_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'estados', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cidades', 'estado_id');
  }
};
