import Sequelize, { Model } from 'sequelize';

class Programa extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING
    }, 
      {
        sequelize,
      }
    );

    return this;
  }
  static associate(models){

    this.belongsTo(models.User, { foreignKey: "user_id", as: "criador" });
  }
}

export default Programa;