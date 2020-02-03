import * as Yup from 'yup';
import Radio from '../models/Radio';
import Cidade from '../models/Cidade';
import User from '../models/User';

import Icon from '../models/IconRadio';

class RadioController{

  async index(req, res){
    try{

      const radios = await Radio.findAll(
        {
          include:[
            {
              model: Cidade,
              as: 'cidade'
            }
          ]
        }
      );

      return res.json(radios);

    } catch (err){
      return res.status(500).json({error: err.message})

    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome da rádio é obrigatório'),
      cidade: Yup.number(),
      link: Yup.string().url('Insira uma url válida').required('A URL é requerida')
    })

    try {
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const { name, cidade, link } = req.body;


      const radioExists = await Radio.findOne({ where: { name: req.body.name } });

      // console.log(radioExists);

      if(radioExists) return res.status(404).json({error: 'Radio já existe'});

      const radio = await Radio.create({
        name,
        cidade_id: cidade,
        link
      })

      return res.json(radio);

    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }

  async update(req, res){
    const schema = Yup.object().shape({
      name: Yup.string(),
      cidade: Yup.number(),
      link: Yup.string().url('Insira uma url válida'),
      icon_id: Yup.number()
    })
    try{
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const {userId} = req;
      const { id : RadioID } = req.params;
      const { icon_id } = req.body;
      
      const userLogado =  await User.findByPk(userId, { attributes: ['id', 'name', 'adm', 'radio_id'] });

      const userADM = userLogado.dataValues;

      if(!userADM.adm && userADM.radio_id != RadioID){
        return res.status(400).json({error: 'Não autorizado a fazer esta aleteração'})
      }

      const radioExists = await Radio.findByPk(RadioID);

      if(!radioExists){
        return res.status(404).json({error: 'Radio Not Found'})
      }

      if(icon_id){
        const iconExists = await Icon.findByPk(icon_id);

        if(!iconExists) {
          return res.status(404).json({error: 'Icon not found'})
        }
      }

      const radioUpdate = await radioExists.update(req.body);

      return res.json(radioUpdate);

    } catch(err){
      return res.status(500).json({error: err.message})

    }
  }
}

export default new RadioController();