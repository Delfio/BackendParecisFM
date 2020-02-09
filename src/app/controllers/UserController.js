import * as Yup from 'yup';
import User from '../models/User';
import Radio from '../models/Radio';
import Avatar from '../models/FotoLocutor';

class UserController{

  async show (req, res){
    try {

      const { id } = req.params;

      const user = await User.findOne({
        attributes: ['name', 'email', 'locutor'],
        where: {
          id: id
        },
        include: [
          {
            model: Radio,
            as: 'radio',
            attributes: ['name']
          },
          {
            model: Avatar,
            as: 'avatar'
          }
        ]
      });

      return res.json(user);
    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }

  async index(req, res){
   
    try {
      const { userId } = req;
      const userLogado = await User.findByPk(userId);

      if(userLogado.adm){
        const users = await User.findAll({
          attributes: ['name', 'email', 'locutor'],
          include: [
            {
              model: Radio,
              as: 'radio',
              attributes: ['name']
            },
            {
              model: Avatar,
              as: 'avatar'
            }
          ]
        });
        return res.json(users)
      }

      const users = await User.findAll({
        attributes: ['name', 'email', 'locutor'],
        where: {
          radio_id: userLogado.radio_id
        },
        include: [
          {
            model: Radio,
            as: 'radio',
            attributes: ['name']
          },
          {
            model: Avatar,
            as: 'avatar'
          }
        ]
      });

      return res.json(users)

    } catch(err) {
      return res.status(500).json({error: err.message})

    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('nome é obrigatório'),
      email: Yup.string().email('insira um email válido').required('O email é obrigatório'),
      cpf: Yup.string().required(),
      password: Yup.string().required('Senha é obrigatória').min(6, 'Minimo de 6 digitos'),
      locutor: Yup.boolean()
    })

    try{

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const userExists = await User.findOne({ where: {email: req.body.email} });

      if(userExists) {
        return res.status(400).json({error: 'Email já em uso'})
      }

      const RadioRequest = await Radio.findByPk(req.body.radio_id);

      if(!RadioRequest){
        return res.status(400).json({error: 'Radio não existe'})
      }

      const { id, name, email, radio, locutor } = await User.create({
        name: req.body.name,
        email: req.body.email,
        radio_id: req.body.radio_id,
        password: req.body.password,
        cpf: req.body.cpf,
        locutor: req.body.locutor? true : false
      });

      return res.json({
        id,
        name,
        email,
        radio,
        locutor
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

      telefone:
        Yup.string().min(9).max(11),

      cidade:
        Yup.string(),

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

      const {id, name, radio_id, cidade, telefone} = await user.update(req.body);

      return res.json({
        id,
        name,
        email,
        cidade,
        telefone,
        radio_id
      });
    } catch (err){
      return res.status(500).json({error: err.message});
    }
  }
}

export default new UserController();