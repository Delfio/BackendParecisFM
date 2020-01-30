import Estado from '../models/Estado';

class EstadosController {
  async store(req, res) {
    try {

      const { nome, uf } = req.body;

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