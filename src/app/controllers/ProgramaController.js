import Programa from '../models/Programa';

class ProgramaController{

  async store(req, res){
    try{

      const dados = req.body;

      const programaExists = await Programa.findOne(
        { where: {
          nome: dados.nome
        } }
      );

      if(programaExists) {
        return res.status(400).json({error: 'Programa já existe'})
      }

      const programa = await Programa.create({
        ...dados,
        user_id: req.userId
      });

      return res.json(programa);

    } catch (err){
      return res.json({error: err.message});
    }
  }

}

export default new ProgramaController();