'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'foto_locutor_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'foto_locutors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'foto_locutor_id');
  }
};
