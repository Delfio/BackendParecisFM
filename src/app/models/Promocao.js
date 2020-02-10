import Sequelize, { Model } from 'sequelize';

class Promocoe extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      link: Sequelize.STRING,
      descricao: Sequelize.STRING,
      facebook: Sequelize.BOOLEAN,
      instagram: Sequelize.BOOLEAN,
      whatsapp: Sequelize.BOOLEAN
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
    this.belongsTo(models.Imagem_promocoes, { foreignKey: "imagem_id", as: "imagem" });
    
  }
}

export default Promocoe;