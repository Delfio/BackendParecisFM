import * as Yup from 'yup';
import Radio from '../models/Radio';

class RadioController{
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome da rádio é obrigatório'),
      cidade: Yup.string().required('A cidade da rádio é obrigatória'),
    })

    try {
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const { name, cidade } = req.body;


      const radioExists = await Radio.findOne({ where: { cidade: req.body.cidade } });

      // console.log(radioExists);

      if(radioExists) return res.status(404).json({error: 'Radio já existe'});

      const radio = await Radio.create({
        name,
        cidade
      })

      return res.json(radio);

    } catch(err){
      return res.status(500).json({error: err.message})
    }
  }
}

export default new RadioController();