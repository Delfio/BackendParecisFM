'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'promocoes',
      'imagem_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'imagem_promocoes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('promocoes', 'imagem_id');
  }
}