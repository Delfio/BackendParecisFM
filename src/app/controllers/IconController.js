import Icon from '../models/IconRadio';

class IconController{

  async store(req,res) {
    try{
      const { originalname: name, filename: path } = req.file;

      const file = await Icon.create({
        name,
        path,
      });
  
      return res.json(file);
    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }

}

export default new IconController();