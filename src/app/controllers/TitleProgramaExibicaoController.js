import * as Yup from 'yup'
import Title from '../models/TitoloProgramaEmExibicao'

class TitleProgramaExibicao{

  async index(req, res){
    try {
      
      const titles = await Title.findAll();

      return res.json(titles);
      
    } catch(err){
      return res.json(err.message)
    }
  }

  async store(req, res){
    const schema = Yup.object().shape({
      nome: Yup.string().required().min(5),
      obs: Yup.boolean().required()
    })
    try {
      if(!(await schema.isValid(req.body))){
        return res.status(401).json({error: 'Confira seus Dados'})
      }
      const {userId} =req;
      const {nome, obs} = req.body;

      const titleExists = await Title.findOne({
        where:{
          nome: nome,
          obs: obs
        }
      });

      if(titleExists){
        return res.status(400).json({Error: 'Titulo já existe'})
      }

      const title = await Title.create({
        nome: nome,
        obs: obs,
        user_id: userId
      });

      return res.json(title)

    } catch (err) {
      return res.json({error: err.message})
    }
  }

}

export default new TitleProgramaExibicao();