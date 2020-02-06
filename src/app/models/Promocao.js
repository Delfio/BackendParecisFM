import Sequelize, { Model } from 'sequelize';

class Promocoe extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      link: Sequelize.STRING,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){
    this.belongsTo(models.Radio, { foreignKey: 'radio_id', as: 'radio' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'cadastrante' });

    this.hasMany(models.ImagemPromocoes, {as: 'image'});
  }
}

export default Promocoe;