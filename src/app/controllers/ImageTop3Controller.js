import ImageTop3 from '../models/ImagemTop3';

class ImageTop3Controller{
  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      const file = await ImageTop3.create({
        name,
        path,
      });
  
      return res.json(file);
    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }
}

export default new ImageTop3Controller();