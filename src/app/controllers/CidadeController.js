import Cidade from '../models/Cidade';

class CidadeController {
  async store(req, res){
    try {
      const { nome, estado } = req.body;

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