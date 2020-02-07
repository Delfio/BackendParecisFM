import Programa from '../models/Programa';
import User from '../models/User';
import Radio from '../models/Radio';

class ProgramaController{

  async show(req, res){
    try {
      const { id } = req.params;

      const programa = await Programa.findOne({
        where: {
          id: id
        }
      });

      return res.json(programa);
    } catch(err){
      return res.json({error: err.message});

    }
  }

  async index(req, res){
    try {

      const programas = await Programa.findAll({
        include:[
          {
            model: User,
            as: 'criador',
            attributes: ['id', 'name', 'locutor'],
            include:[
              {
                model: Radio,
                as: 'radio',
                attributes: ['name'],
              }
            ]
          }
        ]
      });

      return res.json(programas);

    } catch(err){
      return res.json({error: err.message});
    }
  }

  async store(req, res){
    try{

      const dados = req.body;

      const programaExists = await Programa.findOne(
        { where: {
          nome: dados.nome
        } }
      );

      if(programaExists) {
        return res.status(400).json({error: 'Programa já existe'})
      }

      const programa = await Programa.create({
        ...dados,
        user_id: req.userId
      });

      return res.json(programa);

    } catch (err){
      return res.json({error: err.message});
    }
  }

  async update(req, res){
    try{

      const {userId} = req;
      const { id : ProgramaId } = req.params;

      const programa = await Programa.findByPk(ProgramaId)
      const userLogado =  await User.findByPk(userId, { attributes: ['id', 'name', 'adm', 'radio_id'] });
      
      const userADM = programa.dataValues.user_id;
      const userEditar = userLogado.dataValues;

      if(!programa){
        return res.status(400).json({error: 'Programa Not Found'})
      }
      if((userADM != userEditar.id) && !userEditar.adm){
        return res.status(400).json({error: 'Não atorizado a alterar'})
      }

      const programaAtualizado = await programa.update(req.body);

      return res.json(programaAtualizado);

    } catch(err){
      return res.json({error: err.message});

    }
  }

  async delete(req, res){
    try{

      const {userId} = req;
      const { id : ProgramaID } = req.params;
      
      const userLogado =  await User.findByPk(userId, { attributes: ['id', 'name', 'adm', 'radio_id'] });
      const programaExists = await Programa.findByPk(ProgramaID);

      if(!programaExists){
        return res.status(404).json({error: 'Not Found'})
      }

      const userADM = userLogado.dataValues;
      const programaAlterar = programaExists.dataValues;

      if(!userADM.adm && programaAlterar.user_id != userADM.id){
        return res.status(400).json({error: 'Não autorizado'})
      }

      if(!programaExists){
        return res.status(404).json({error: 'Programa Not Found'})
      };

      await programaExists.destroy();

      return res.status(200).json({ok: 'Sucess'})

    } catch(err){
      return res.status(500).json({error: err.message})

    }
  }

}

export default new ProgramaController();