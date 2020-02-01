import Sequelize, { Model } from 'sequelize';

class Programacao extends Model {
  static init(sequelize) {
    super.init({
      horario: Sequelize.STRING
    }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){
    this.belongsTo(models.Radio, { foreignKey: 'radio_id', as: 'radio' }),
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'cadastrante' }),
    this.belongsTo(models.Programa, { foreignKey: 'programa_id', as: 'programa' }),
    this.belongsTo(models.Dias, { foreignKey: 'dia_id', as: 'dia' })
  }
}

export default Programacao;