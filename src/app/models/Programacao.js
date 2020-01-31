import Sequelize, { Model } from 'sequelize';

class Programacao extends Model {
  static init(sequelize) {
    super.init({
      horario: Sequelize.STRING,
      user_id: Sequelize.INTEGER,
      radio_id: Sequelize.INTEGER,
      programa_id: Sequelize.INTEGER,
      dia_id: Sequelize.INTEGER
    }, 
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Programacao;