import * as Yup from 'yup';
import Cidade from '../models/Cidade';

class CidadeController {
  async store(req, res){
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().min('4').required('Insira o nome da cidade'),
        estado: Yup.number().max(26, 'UF INVÁLIDA').required('Insira uma UF')
      })
      
      if(!(await schema.isValid(req.body))) {
        return res.status(401).json({error: 'Verifique os campos'})
      }

      const { nome, estado } = req.body;

      const cidadeEXISTS = await Cidade.findOne({ where: { nome } });

      if(cidadeEXISTS) return res.status(401).json({error: 'cidade já existe'});

      const cidade = await Cidade.create({
        nome,
        estado_id: estado
      });

      return res.json(cidade)
    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }
}

export default new CidadeController();