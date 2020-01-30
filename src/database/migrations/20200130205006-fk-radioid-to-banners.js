'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'banners',
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
    return queryInterface.removeColumn('banners', 'radio_id');
  }
};
