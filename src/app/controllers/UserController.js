import User from '../models/User';

class UserController{

  async store(req, res) {
    try{
      const userExists = await User.findOne({ where: {email: req.body.email} });

      if(userExists) {
        return res.status(400).json({error: 'Email já em uso'})
      }

      const { id, name, email } = await User.create(req.body);

      return res.json({
        id,
        name,
        email
      });

    }catch(err){
      return res.status(500).json({error: err.message})
    }
  }

}

export default new UserController();