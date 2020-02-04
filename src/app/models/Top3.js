import Sequelize, { Model } from 'sequelize';

class Top3 extends Model {
  static init(sequelize) {
    super.init({
      artista: Sequelize.STRING,
      musica: Sequelize.STRING,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){
    this.belongsTo(models.ImagemTop3s, { foreignKey: "imagem_id", as: "image" });
    this.belongsTo(models.Radio, { foreignKey: "radio_id", as: "radio" });
  }
}

export default Top3;