import * as Yup from 'yup'
import Contato from '../models/Contato';

import Radio from '../models/Radio';
import User from '../models/User';

class ContatoController{

  async show(req, res){
    try {
      const { id } = req.params;

      const contato = await Contato.findOne({
        where: {
          id: id
        }
      });

      return res.json(contato);

    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }

  async index(req, res){
    try {
      const {userId} = req;
      const userLogado = await User.findByPk(userId);

      if(userLogado.adm){
        const contato = await Contato.findAll({
          order:[
            ['tipo', 'ASC']
          ],
        });
  
        return res.json(contato);
      }

      const contato = await Contato.findAll({
        where: {
          radio_id: userLogado.radio_id
        },
        order:[
          ['tipo', 'ASC']
        ],
      });

      return res.json(contato);
      

    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }

  async store(req, res){
    const schema = Yup.object().shape({
      tipo: Yup.number().min(1).max(3).required(),
      link: Yup.string().required(),
      radio_id: Yup.number(),
    })
    try {

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Confira seus dados'})
      };

      const { id } = req.params;
      const { userId } = req;
      const dados = req.body;

      const radioRequest = await Radio.findByPk(id);
      const userLogado = await User.findByPk(userId);

      if(!radioRequest){
        return res.status(400).json({error: 'Radio inválida'})
      };

      if(!userLogado.adm && id != userLogado.radio_id){
        return res.status(400).json({error: 'Não autorizado a fazer essa ação'})
      }else{
        const contato = await Contato.create({
          tipo: dados.tipo,
          link: dados.link,
          user_id: userLogado.id,
          radio_id: id
        })

        return res.json(contato);
      }

    } catch (err) {
      return res.json({error: err.message});
    }
  }

  async update(req, res){
    const schema = Yup.object().shape({
      tipo: Yup.number().min(1).max(1),
      link: Yup.string().url(),
      radio_id: Yup.number(),
    })
    try {
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Confira seus dados'})
      };

      const {id} = req.params
      const { userId } = req;

      const userLogado = await User.findByPk(userId);
      const contatoExists = await Contato.findByPk(id);

      if(!contatoExists){
        return res.status(404).json({error: 'Not found'})
      
      }else if(contatoExists.radio_id != userLogado.radio_id && !userLogado.adm) {
        return res.status(400).json({error: 'Não autorizado a fazer esta ação'})
      }
      
      const contatoAtt = await contatoExists.update(req.body);

      return res.json(contatoAtt);

    } catch(err){
      return res.json({error: err.message});

    }
  }

  async delete(req, res) {
    try {

      const {id} = req.params;
      const {userId} = req;

      const contatoExists = await Contato.findByPk(id);
      const userLogado = await User.findByPk(userId);

      if(!contatoExists){
        return res.status(404).json({error: 'Não existe esse contato'})
      
      }else if(contatoExists.radio_id != userLogado.radio_id && !userLogado.adm){
        return res.status(400).json({error: 'Não autorizado'})

      }

      await contatoExists.destroy();

      return res.json({ok: true})

    } catch (err) {

    }
  }

}

export default new ContatoController();