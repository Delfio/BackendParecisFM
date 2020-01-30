import Sequelize from 'sequelize';

import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Banner from '../app/models/Banner';
import Radio from '../app/models/Radio';
import Pedidos from '../app/models/Pedidos';


import Estado from '../app/models/Estado';
import Cidade from '../app/models/Cidade';

const models = [User, Banner, Radio, Pedidos, Estado, Cidade];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model =>  model.init(this.connection));
  }

  mongo() {
    this.mongoConnectioon = mongoose.connect('mongodb+srv://rootParecisFM:sefode12@cluster0-um3uc.mongodb.net/parecisfm?retryWrites=true&w=majority',
    {
      useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true
    })
  }
}

export default new Database();