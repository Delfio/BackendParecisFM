import BannerPromocao from '../models/BannerPromocao'
import Promocao from '../models/Promocao'

import User from '../models/User'

class BannerPromocaoController {

  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      // const {userId} = req;

      // const user = await User.findByPk(userId);

      const file = await BannerPromocao.create({
        name,
        path,
      });
  
      return res.json(file);
    } catch(err){
      console.log(err.message);
      return res.status(500).json({error: err.message})
    }
  }

}

export default new BannerPromocaoController();


