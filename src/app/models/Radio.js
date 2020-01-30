import Sequelize, { Model } from 'sequelize';

class Radio extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      link: Sequelize.STRING,
      cidade_id: Sequelize.INTEGER,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Radio;