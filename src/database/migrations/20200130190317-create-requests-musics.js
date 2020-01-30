'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pedidos', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      artista: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      musica: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      radio_id: {
        type: Sequelize.INTEGER,
        references: { model: 'radios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('pedidos');

  }
};
