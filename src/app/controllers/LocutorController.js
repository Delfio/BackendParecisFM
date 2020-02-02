import User from '../models/User';
import FotoLocutor from '../models/FotoLocutor';

class LocutorController {

  async update(req, res){
    try {
      const {userId} = req;
      const { user_id, foto_locutor_id } = req.body;
  
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