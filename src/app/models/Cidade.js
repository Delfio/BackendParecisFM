import Sequelize, { Model } from 'sequelize';

class Cidade extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      estado_id: Sequelize.INTEGER
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

}

export default Cidade;