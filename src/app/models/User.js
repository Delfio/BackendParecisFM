import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      cpf: Sequelize.STRING(11),
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      locutor: Sequelize.BOOLEAN,
      adm: Sequelize.BOOLEAN
    }, 
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if(user.password){
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
  static associate(models) {
    //Relacionamento de fk
    this.belongsTo(models.Foto_locutors, { foreignKey: "foto_locutor_id", as: "avatar" });
    this.belongsTo(models.Radio, { foreignKey: "radio_id", as: "radio" });
  }
}

export default User;