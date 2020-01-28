import Sequelize, { Model } from 'sequelize';

class Banner extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      radio_id: Sequelize.INTEGER
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

}

export default Banner;