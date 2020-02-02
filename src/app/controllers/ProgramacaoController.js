import * as Yup from 'yup'
import Programacao from '../models/Programacao';

import User from '../models/User';
import Programa from '../models/Programa';

class ProgramacaoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      horario: Yup.string().required().min(5).max(5),
      radio_id: Yup.number(),
      programa_id: Yup.number().required(),
      dia_id: Yup.number().required(),
      user_id: Yup.number()
    });
    try{

      if(!( await schema.isValid(req.body))) {
        return res.status(400).json({error: 'Verifique os dadaos'})
      }

      const userLogado = await User.findByPk(req.userId);

      const dados = req.body;

      const programacaoExists = await Programacao.findOne({ 
        where: { 
          programa_id: dados.programa_id,
          horario: dados.horario,
          dia_id: dados.dia_id,
          radio_id: userLogado.adm ? dados.radio_id : userLogado.radio_id
        } 
      });

      if(programacaoExists){
        return res.status(400).json({error: 'Programação já existe'});
      }

      const LocutorRequired = await User.findByPk(dados.user_id);
      const ProgramaExsits = await Programa.findByPk(dados.programa_id);

      console.log(LocutorRequired, " 44444  ", ProgramaExsits)

      if( !LocutorRequired || !ProgramaExsits ){
        return res.status(400).json({error: 'Dados, inexistentes'})

      }else if(LocutorRequired.locutor === false){
        return res.status(400).json({error: 'Usuario não é um locutor'})

      }else if( LocutorRequired.radio_id != dados.radio_id ){
        return res.status(400).json({error: 'Usuário não pertence a esta rádio'})

      }

      const programacao = await Programacao.create({
        horario: dados.horario,
        programa_id: dados.programa_id,
        dia_id: dados.dia_id,
        user_id: req.user_id,
        radio_id: userLogado.adm? dados.radio_id : userLogado.radio_id
      })

      return res.json(programacao)

    } catch (err) {
      return res.json({error: err.message})
    }
  }
}

export default new ProgramacaoController();