import BannerPromocao from '../models/BannerPromocao'
import Promocao from '../models/Promocao'

import User from '../models/User'

class BannerPromocaoController {

  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      const { id } = req.params;

      const {userId} = req;

      const user = await User.findByPk(userId);
      const promocao = await Promocao.findByPk(id);

      const bannerExists = await BannerPromocao.findAll({
        where: {
          promocao_id: id
        }
      });

      if( bannerExists.length >= 1 ){
        return res.status(400).json({error: 'Já existe uma imagem'})
      }

      if(!promocao){
        return res.status(404).json({error: 'Promoção Not Found'})
      }

      if(!user.adm && promocao.radio_id != user.radio_id){
        return res.status(400).json({error: false})
      }

      const file = await BannerPromocao.create({
        name,
        path,
        promocao_id: id
      });
  
      return res.json(file);
    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }

}

export default new BannerPromocaoController();


