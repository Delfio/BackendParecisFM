import Sequelize, { Model } from 'sequelize';

class Estado extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      uf: Sequelize.STRING
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

}

export default Estado;