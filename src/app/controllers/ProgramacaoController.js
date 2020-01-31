import * as Yup from 'yup'
import Programacao from '../models/Programacao';

class ProgramacaoController {
  async store(req, res) {
    try{
      const schema = Yup.object().shape({
        horario: Yup.string().required().min(5).max(5),
        radio_id: Yup.number().required(),
        programa_id: Yup.number().required(),
        dia_id: Yup.number().required()
      });

      if(!( await schema.isValid(req.body))) {
        return res.status(400).json({error: 'Verifique os dadaos'})
      }

      const dados = req.body

      const programacaoExists = await Programacao.findOne({ 
        where: { 
          programa_id: dados.programa_id,
          horario: dados.horario,
          dia_id: dados.dia_id
        } 
      });

      if(programacaoExists){
        return res.status(400).json({error: 'Programação já existe'});
      }

      const programacao = await Programacao.create({
        ...dados,
        user_id: req.userId
      })

      return res.json(programacao)

    } catch (err) {
      return res.json({error: err.message})
    }
  }
}

export default new ProgramacaoController();