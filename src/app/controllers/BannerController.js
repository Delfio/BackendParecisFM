import Banner from '../models/Banner'

class BannerController {

  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      const { id } = req.params;

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