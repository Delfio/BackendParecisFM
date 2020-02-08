import User from '../models/User';
import FotoLocutor from '../models/FotoLocutor';
import Radio from '../models/Radio';
import Cidade from '../models/Cidade';

class LocutorController {

  async index(req, res){
    try{
      const {id} =req.params;
      const user = await User.findAll({
        where: { locutor: true, radio_id: id },
        attributes:['id', 'name', 'email', 'radio_id'],
        include:[
          {
            model: FotoLocutor,
            as: 'avatar',
            attributes: [ 'name', 'path', 'url' ]
          },
          {
            model: Radio,
            as: 'radio',
            attributes:['id','name', 'link'],
            include: [
              {
                model: Cidade,
                as: 'cidade',
                attributes:['nome'],
              }
            ]
          }
        ]
      });

      return res.json(user)

    } catch (err){
      return res.status(500).json({error: err.message});
    }
  }

  async update(req, res){
    try {
      const {userId} = req;
      const { user_id, foto_locutor_id } = req.body;

      const fotoExists = await FotoLocutor.findByPk(foto_locutor_id);

      if(!fotoExists) {
        return res.status(404).json({error: 'Imagem not Found'})
      }
  
      const userLogado =  await User.findByPk(userId, { attributes: ['id', 'name', 'adm', 'locutor', 'radio_id'] });
      const userRequired =  await User.findByPk(user_id);

      const userADM = userLogado.dataValues;
      const userAlterar = userRequired? userRequired.dataValues.locutor: null;

      if(userADM.adm && userRequired && userAlterar){

        const {id, name, radio_id} = await userRequired.update(
          {foto_locutor_id}
        );

        return res.json({
          id,
          name,
          radio_id
        });
      } else if(userADM.locutor){

        const {id, name, radio_id} = await userLogado.update(
          {foto_locutor_id}
        );

        return res.json({
          id,
          name,
          radio_id
        });
      } else{
        return res.status(400).json({error: 'Dados incorretos'})
      }

      return res.json({
        ok: true
      });
    } catch (err){
      return res.status(500).json({error: err.message});
    }
  }

}

export default new LocutorController();