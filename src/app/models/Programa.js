import Sequelize, { Model } from 'sequelize';

class Programa extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      user_id: Sequelize.INTEGER,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Programa;