import Banner from '../models/Banner'

import User from '../models/User'

class BannerController {

  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      const { id } = req.params;

      const {userId} = req;

      const user = await User.findByPk(userId);

      if(!user.adm && (user.radio_id != id)){
        return res.status(401).json({error: 'Não autorizado'})
      }

      const file = await Banner.create({
        name,
        path,
        radio_id: id
      });
  
      return res.json(file);
    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }

}

export default new BannerController();