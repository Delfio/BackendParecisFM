import Sequelize, { Model } from 'sequelize';

class Radio extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      link: Sequelize.STRING,
    }, 
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models){
    this.hasMany(models.Programacao, {as: 'programacao'});
    this.hasMany(models.Programacao, {as: 'allprogramacao'});
    this.hasMany(models.User, {as: 'usuario'});
    this.hasMany(models.Banner, {as: 'banner1'});
    this.hasMany(models.Banner, {as: 'banner2'});
    this.hasMany(models.Pedido, {as: 'pedido'});
    this.hasMany(models.Contato, {as: 'contato'});
    this.hasMany(models.Promocoe, {as: 'promocao'});
    this.hasMany(models.Top3, {as: 'top3'});

    this.belongsTo(models.Cidade, { foreignKey: "cidade_id", as: "cidade" });
    this.belongsTo(models.Icon, { foreignKey: "icon_id", as: "icon" });
  }
}

export default Radio;