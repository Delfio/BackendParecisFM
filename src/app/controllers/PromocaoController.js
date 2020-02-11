import * as Yup from 'yup'
import Promocao from '../models/Promocao';
import BannerPromocao from '../models/BannerPromocao';
import User from '../models/User';
import Radio from '../models/Radio';

import {Op} from 'sequelize'

class PromocaoController {

  async show (req, res) {
    try {
      const { id } = req.params;

      const promocao = await Promocao.findAll({
        where: {
          id: id
        },
        include: [
          {
            model: BannerPromocao,
            as: 'imagem'
          },
          {
            model: Radio,
            as: 'radio',
            attributes: [ 'facebook', 'instagram', 'whatsapp' ]
          }
        ]
      })

      return res.json(promocao);
    } catch(err){
      return res.json({error: err.message});

    }
  }

  async index (req, res){
    try {
      const { id } = req.params;

      if(id){
        const promocao = await Promocao.findAll({
          where:{
            radio_id: id
          },
          include: [
            {
              model: BannerPromocao,
              as: 'imagem'
            }
          ]
        });

        if(promocao.length === 0){
          return res.json([])
        }

        return res.json(promocao)
      }

      const promocao = await BannerPromocao.findAll({
        attributes: ['url', 'path', 'id', 'promocao_id'],
        include: [
          {
            model: Promocao,
            as: 'promocao',
            where: {
              id: {
                [Op.ne]: null
              }
            },
            include: [
              {
                model: User,
                as: 'cadastrante',
                attributes: ['id', 'name', 'email'],
                include: [
                  {
                    model: Radio,
                    as: 'radio',
                    attributes: ['name']
                  }
                ]
              }
            ]
          }
        ]
      });

      return res.json(promocao)


    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }

  async store(req, res){
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      link: Yup.string().url(),
      descricao: Yup.string().required(),
      facebook: Yup.boolean(),
      instagram: Yup.boolean(),
      whatsapp: Yup.boolean(),
    })
    try {

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Verifique seus dados'})
      }

      const { userId } = req;

      const { id: radio_id } = req.params;

      const userLogado = await User.findByPk(userId);
      const radioExists = await Radio.findByPk(radio_id);

      const user = userLogado.dataValues;

      if(!radioExists){
        return res.status(404).json({error: 'Radio Não existe'})
      };

      if(user.radio_id != radio_id && !user.adm){
        return res.status(404).json({error: 'Não autorizado a fazer este tipo de ação'})

      }

      const promocao = await Promocao.create({
        nome: req.body.nome,
        link: req.body.link,
        radio_id: radio_id,
        user_id: userId,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        whatsapp: req.body.whatsapp,
        descricao: req.body.descricao
      });

      return res.json(promocao);

    } catch(err){
      return res.status(500).json({error: err.message})
    }

  }

  async update(req, res){
    const schema = Yup.object().shape({
      nome: Yup.string(),
      link: Yup.string().url(),
      imagem_id: Yup.number()
    })
    try {
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Verifique seus dados'})
      }

      const { userId } = req;
      const { imagem_id } = req.body
      const { id: promocaoID } = req.params;
      
      const userLogado = await User.findByPk(userId);
      const promocoesRequest = await Promocao.findByPk(promocaoID);

      if(imagem_id){
        const bannerRequest = await BannerPromocao.findByPk(imagem_id);
        if(!bannerRequest){
          return res.status(404).json({error: 'Não existe esse banner'})
        }
      }

      if(!promocoesRequest){
        return res.status(404).json({error: 'Not found'})
      }

      if(promocoesRequest.user_id != userId && !userLogado.adm && promocoesRequest.radio_id != userLogado.radio_id){
        return res.status(400).json({error: false})
      }

      await promocoesRequest.update(req.body);

      return res.json(promocoesRequest);

    } catch (err){
      return res.status(500).json({error: err.message})
    }
  }

  async delete(req, res){
    try {

      const { id } = req.params;
      const {userId} = req;

      const userLogado = await User.findByPk(userId);
      const promocaoExists = await Promocao.findByPk(id);

      if(!promocaoExists) {
        return res.status(404).json({error: 'Promoção não existe'})
      }

      if((!userLogado.adm && promocaoExists.user_id != userLogado.id) && promocaoExists.radio_id != userLogado.id){
        return res.status(400).json({erro: false})
      };

      await promocaoExists.destroy();

      return res.json({ok: true})

    } catch (err) {
      return res.status(500).json({error: err.message})

    }
  }

}

export default new PromocaoController();