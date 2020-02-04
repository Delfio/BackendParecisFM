import 'dotenv/config';

import Sequelize, { Model } from 'sequelize';

class ImagemTop3s extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // tem que permitir o navegador acessar a imagem sem precisar se autenticar! "app.js"
            return `${process.env.APP_URL}/files/${this.path}`;
          }
        }
      },
      {
        sequelize
      }
    );

    return this;
  }

}

export default ImagemTop3s;