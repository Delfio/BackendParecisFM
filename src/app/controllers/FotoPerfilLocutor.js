import FotoPerfil from '../models/FotoLocutor'
import User from '../models/User'

class FotoPerfilLocutor{

  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      const { id } = req.params;

      const {userId} = req;

      const user = await User.findByPk(userId);

      console.log(user.adm);
  
      // return res.json(file);
    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }

}

export default new FotoPerfilLocutor();