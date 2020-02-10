'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('programacoes_em_exibicaos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      horario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      programa_id: {
        type: Sequelize.INTEGER,
        references: { model: 'programas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      radio_id: {
        type: Sequelize.INTEGER,
        references: { model: 'radios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      titulos_programacoes_em_exibicao_id: {
        type: Sequelize.INTEGER,
        references: { model: 'titulos_programacoes_em_exibicaos', key: 'id' },
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

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('programacoes_em_exibicaos');
    
  }
};
