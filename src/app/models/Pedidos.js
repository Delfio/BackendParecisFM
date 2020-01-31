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
      radio_id: Sequelize.INTEGER
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

}

export default Pedido;