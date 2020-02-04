import 'dotenv/config';

import Sequelize, { Model } from 'sequelize';

class Banner extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      type: Sequelize.BOOLEAN,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          // tem que permitir o navegador acessar a imagem sem precisar se autenticar! "app.js"
          return `${process.env.APP_URL}/files/${this.path}`;
        } 
      }
    }, 
      {
        sequelize,
      }
    );


    return this;
  }

  static associate(models) {
    //Relacionamento de fk
    this.belongsTo(models.Radio, { foreignKey: "radio_id", as: "radio" });
  }

}

export default Banner;