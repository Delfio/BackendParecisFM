import * as Yup from 'yup'
import Promocao from '../models/Promocao';
import User from '../models/User';
import Radio from '../models/Radio';

class PromocaoController {

  async store(req, res){
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      link: Yup.string().url().required()
    })
    try {

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Verifique seus dados'})
      }

      const { userId } = req;
      const { id: radio_id } = req.params;

      const userLogado = await User.findByPk(userId);
      const radioExists = await Radio.findByPk(radio_id);

      const user = userLogado.dataValues;

      if(!radioExists){
        return res.status(404).json({error: 'Radio Não existe'})
      };

      if(user.radio_id != radio_id && !user.adm){
        return res.status(404).json({error: 'Não autorizado a fazer este tipo de ação'})

      }

      const promocao = await Promocao.create({
        nome: req.body.nome,
        link: req.body.link,
        radio_id: radio_id
      });

      return res.json(promocao);

    } catch(err){
      return res.status(500).json({error: err.message})
    }

  }

}

export default new PromocaoController();