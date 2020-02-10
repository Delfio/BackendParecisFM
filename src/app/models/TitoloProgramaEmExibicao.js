import Sequelize, { Model } from 'sequelize';

class Titulos_programacoes_em_exibicao extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      obs: Sequelize.BOOLEAN,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){

    this.hasMany(models.Programacoes_em_exibicao, {as: 'programa'})

    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'cadastrante' });
  }
}

export default Titulos_programacoes_em_exibicao;