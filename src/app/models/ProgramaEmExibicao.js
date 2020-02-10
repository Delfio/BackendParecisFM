import Sequelize, { Model } from 'sequelize';

class Programacoes_em_exibicao extends Model {
  static init(sequelize) {
    super.init({
      horario: Sequelize.STRING,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){
    this.belongsTo(models.Radio, { foreignKey: 'radio_id', as: 'radio' });
    
    this.belongsTo(models.Titulos_programacoes_em_exibicao, { foreignKey: 'titulos_programacoes_em_exibicao_id', as: 'title' });
    this.belongsTo(models.Programa, { foreignKey: "programa_id", as: "programa" });
    
  }
}

export default Programacoes_em_exibicao;