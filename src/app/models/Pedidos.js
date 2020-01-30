import Sequelize, { Model } from 'sequelize';

class Pedido extends Model {
  static init(sequelize) {
    super.init({
      musica: Sequelize.STRING,
      artista: Sequelize.STRING,
      radio_id: Sequelize.INTEGER,
      data: Sequelize.DATE
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

}

export default Pedido;