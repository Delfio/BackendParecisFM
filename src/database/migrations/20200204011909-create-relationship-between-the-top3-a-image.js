'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'top3s',
      'imagem_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'imagem_top3s', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('top3s', 'imagem_id');
  }
};

