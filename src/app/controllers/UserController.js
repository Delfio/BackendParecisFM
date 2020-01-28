import * as Yup from 'yup';
import User from '../models/User';


class UserController{

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('nome é obrigatório'),
      email: Yup.string().email('insira um email válido').required('O email é obrigatório'),
      password: Yup.string().required('Senha é obrigatória').min(6, 'Minimo de 6 digitos')
    })

    try{

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const userExists = await User.findOne({ where: {email: req.body.email} });

      if(userExists) {
        return res.status(400).json({error: 'Email já em uso'})
      }

      const { id, name, email, radio } = await User.create({
        name: req.body.name,
        email: req.body.email,
        radio_id: req.body.radio_id,
      });

      return res.json({
        id,
        name,
        email,
        radio
      });

    }catch(err){
      return res.status(500).json({error: err.message})
    }
  }

  async update(req,res){

    const schema = Yup.object().shape({
      name:
        Yup.string(),

      email:
        Yup.string().email(),

      oldPassword:
        Yup.string().min(6),

      password:
        Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
        oldPassword ? field.required(): field
        ),

      confirmPassword:
        Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      radio_id:
        Yup.number(),
    });

    try {
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const {userId} = req;

      const {email, oldPassword, password} = req.body;
  
      const user =  await User.findByPk(userId);
  
      if(email && (email !== user.email)){
        const userExists = await User.findOne({ where: {email} });
  
        if(userExists) {
          return res.status(400).json({error: 'Email já em uso'})
        }
      }

      if(!oldPassword && password ){
        return res.status(401).json({error: 'Senha antiga não confere'})
      }
  
      if(oldPassword && !(await user.checkPassword(oldPassword))){
        return res.status(401).json({error: 'Senha não confere'})
      }

      const {id, name, radio_id} = await user.update(req.body);

      return res.json({
        id,
        name,
        email,
        radio_id
      });
    } catch (err){
      return res.status(500).json({error: err.message});
    }
  }
}

export default new UserController();