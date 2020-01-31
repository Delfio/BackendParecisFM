import * as Yup from 'yup';
import Estado from '../models/Estado';

class EstadosController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().min('4').required('Insira o nome do estado'),
        uf: Yup.string().max(2, 'UF INVÁLIDA').required('Insira uma UF')
      })

      if(!(await schema.isValid(req.body))) {
        return res.status(401).json({error: 'Verifique os campos'})
      }

      const { nome, uf } = req.body;

      const estadoExists = await Estado.findOne({ where: { nome } });

      const ufexists = await Estado.findOne({ where: { uf } })

      if(estadoExists || ufexists){
        return res.status(401).json({error: "Estado já foi criado"})
      }

      const estado = await Estado.create({
        nome,
        uf
      });

      return res.json(estado)

    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }
}

export default new EstadosController();