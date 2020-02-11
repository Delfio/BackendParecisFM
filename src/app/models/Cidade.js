import Sequelize, { Model } from 'sequelize';

class Cidade extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
    }, 
      {
        sequelize,
      }
    );


    return this;
  }
  static associate(models) {
    //Relacionamento de fk
    this.belongsTo(models.Estado, { foreignKey: "estado_id", as: "estado" })
  }

}

export default Cidade;