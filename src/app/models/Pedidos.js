import Sequelize, { Model } from 'sequelize';

class Pedido extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      idade: Sequelize.STRING,
      telefone: Sequelize.STRING,
      artista: Sequelize.STRING,
      musica: Sequelize.STRING,
      data: Sequelize.DATE,
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

  static associate(models){
    this.belongsTo(models.Radio, { foreignKey: 'radio_id', as: 'radio' }),
    this.belongsTo(models.Programacao, { foreignKey: 'programacao_id', as: 'programacao' })
  }
}

export default Pedido;