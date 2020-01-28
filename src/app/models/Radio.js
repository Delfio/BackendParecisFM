import Sequelize, { Model } from 'sequelize';

class Radio extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      cidade: Sequelize.STRING
    }, 
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Radio;