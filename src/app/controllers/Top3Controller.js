import * as Yup from 'yup';
import Top3 from '../models/Top3';

import ImagemTop3 from '../models/ImagemTop3';

import Radio from '../models/Radio';
import User from '../models/User';

class Top3Controller {

  async show(req, res) {
    try {
      const { id } = req.params;

      const top3s = await Top3.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: ImagemTop3,
            as: 'image'
          }
        ]
      });

      return res.json(top3s)
    } catch (err) {
      return res.status(500).json({error: err.message})

    } 
  }

  async index(req, res){
    try {
      const {id: RadioID} = req.params;
      const {userId} = req;

      const userLogado = await User.findByPk(userId);

      if(RadioID){
        const top3s = await Top3.findAll({
          where: {
            radio_id: RadioID
          },
          limit: 3,
          order:[
            ['id', 'DESC']
          ],
          include:[
            {
              model: ImagemTop3,
              as: 'image'
            }
          ]
        });

        return res.json(top3s);
      }

      if(userLogado.adm && !RadioID){
        const top3s = await Top3.findAll({
          limit: 3,
          order:[
            ['id', 'DESC']
          ],
          include:[
            {
              model: ImagemTop3,
              as: 'image'
            }
          ]
        });

        return res.json(top3s)
      }

      if(!userLogado.adm && !RadioID){
        const {radio_id} = userLogado;
        const top3s = await Top3.findAll({
          where:{
            radio_id
          },
          limit: 3,
          order:[
            ['id', 'DESC']
          ],
          include:[
            {
              model: ImagemTop3,
              as: 'image'
            }
          ]
        });

        return res.json(top3s)

      }

      return res.json({ok: 'Como tu burlo isso bixo?'})

    } catch(err) {
      return res.status(500).json({error: err.message})
    }
  }

  async store(req, res){
    const schema = Yup.object().shape({
      artista: Yup.string().required('O nome da rádio é obrigatório'),
      musica: Yup.string().required(),
      imagem_id: Yup.number()
    })
    try {
      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({error: 'confira seus dados'})
      }

      const {id} = req.params;
      const {userId} = req;

      const { imagem_id } = req.body;

      if(imagem_id) {
        const imagemExists = await ImagemTop3.findByPk(imagem_id);

        if(!imagemExists){
          return res.status(404).json({error: 'Imagem inexistente'})
        }
      }

      const userLogado = await User.findByPk(userId);
      const radioRequest = await Radio.findByPk(id);

      if(!radioRequest) {
        return res.status(404).json({error: 'Radio não existe'})

      }else if(!userLogado.adm && userLogado.radio_id != id){
        return res.status(400).json({error: 'Não autorizado a fazer esta ação'})
      };

      const top3Exists = await Top3.findAll({
        where: {
          artista: req.body.artista,
          musica: req.body.musica
        }
      });

      const dados = req.body;

      if(top3Exists.length >= 1) {
        return res.status(400).json({error: 'Já existe'})
      };

      const top3 = await Top3.create({
        artista: dados.artista,
        musica: dados.musica,
        imagem_id: dados.imagem_id,
        radio_id: userLogado.adm ? (dados.radio_id ? dados.radio_id : userLogado.radio_id ): userLogado.radio_id
      });
      return res.json(top3);
    } catch (err) {
      return res.status(500).json({error: err.message})
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      artista: Yup.string(),
      musica: Yup.string(),
      imagem_id: Yup.number()
    })
    try {
      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({error: 'confira seus dados'})
      }

      const {id} = req.params;
      const {userId} = req;
      const { imagem_id } = req.body;
      const { radio_id } = req.body;

      const userLogado = await User.findByPk(userId);
      const top3Request = await Top3.findByPk(id);

      if(!top3Request){
        return res.status(404).json({error: 'Dados inválidos'})
        
      }else if(imagem_id) {
        const imagemExists = await ImagemTop3.findByPk(imagem_id);

        if(!imagemExists){
          return res.status(404).json({error: 'Imagem inexistente'})
        }
      } else if(radio_id){
        const radioRequest = await Radio.findByPk(radio_id);

        if(!radioRequest) {
          return res.status(404).json({error: 'Radio Inexistente'})
        }
      } else if( (!userLogado.adm && top3Request.user_id != userLogado.id) && (top3Request.radio_id != userLogado.radio_id)){
        return res.status(404).json({error: 'Não autorizado'})

      }

      await top3Request.update(req.body);

      return res.json(top3Request);
    } catch (err) {
      return res.status(500).json({error: err.message})
    }
  }

  async delete(req, res){
    try {
      
      const {id} = req.params;
      const {userId} = req;
      
      const top3Request = await Top3.findByPk(id);
      const userLogado = await User.findByPk(userId);

      if(!top3Request){
        return res.status(404).json({error: 'Not found'})

      } else if(top3Request.radio_id != userLogado.radio_id && !userLogado.adm){
        return res.status(400).json({error: 'Não autorizado'})
      }

      await top3Request.destroy();
      return res.json({ok: true});

    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }

}

export default new Top3Controller();