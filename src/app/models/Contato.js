import Sequelize, { Model } from 'sequelize';

class Contato extends Model {
  static init(sequelize) {
    super.init({
      tipo: Sequelize.ENUM(['1', '2', '3']),
      link: Sequelize.STRING,
    }, 
      {
        sequelize,
      }
    );


    return this;
  }
  static associate(models){
    this.belongsTo(models.Radio, { foreignKey: 'radio_id', as: 'radio' }),
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'locutor' })
  }

}

export default Contato;