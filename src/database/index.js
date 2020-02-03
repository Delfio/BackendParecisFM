import 'dotenv/config';

import Sequelize from 'sequelize';

import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import FotoLocutor from '../app/models/FotoLocutor';

import Banner from '../app/models/Banner';
import Icon from '../app/models/IconRadio';
import Radio from '../app/models/Radio';
import Pedido from '../app/models/Pedidos';


import Estado from '../app/models/Estado';
import Cidade from '../app/models/Cidade';

import Dia from '../app/models/Dia';
import Programacao from '../app/models/Programacao';
import Programa from '../app/models/Programa';

const models = [
  User, 
  Banner, 
  Icon,
  Radio, 
  Pedido, 
  Estado, 
  Cidade, 
  Dia, 
  Programacao,
  Programa,
  FotoLocutor
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Conexão com a base de dados, que está sendo esperada pela "init()" nos models!

    models
      .map(model => model.init(this.connection)) // for para acessar o array das classes e seus metodos
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnectioon = mongoose.connect(process.env.mongo_URL,
    {
      useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true
    })
  }
}

export default new Database();