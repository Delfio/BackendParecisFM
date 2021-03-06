import * as Yup from 'yup';

import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';
import FotoLocutor from '../models/FotoLocutor';

class SessionController{
  async store(req, res){
    try{

      const schema = Yup.object().shape({
        email:
          Yup.string().required().email(),
        password:
          Yup.string().required()
      });
  
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({ error: 'Dados invalidos para sesão' })
      }

      const {email, password} = req.body;

      const user = await User.findOne({
        where: {email},
        include: [
          {
            model: FotoLocutor,
            as: 'avatar'
          }
        ]
      });

      if(!user){
        res.status(401).json({error: 'Usuário não encontrado'})
      }

      if (!(await user.checkPassword(password))){
        res.status(401).json({error: 'Senha Inválida'})
      }

      const { id, name, radio_id, adm, locutor, avatar } = user;

      return res.json({
        user: {
          id,
          name,
          radio_id,
          adm,
          locutor,
          email,
          avatar
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        }),
      })

    } catch(err){

    }
  }

}

export default new SessionController();