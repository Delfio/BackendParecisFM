import Dias from '../models/Dia'


class DiasController {
  async store(req, res){
    try{
      const dados = req.body;

      const diaExists = await Dias.findOne(
        { where: {
          nome: dados.nome
        } }
      );

      if(diaExists) {
        return res.status(400).json({error: 'Dia já existe'})
      }

      const dia = await Dias.create({
        ...dados
      });

      return res.json(dia);

    } catch (err){
      return res.json({error: err.message});
    }

  }
}

export default new DiasController();