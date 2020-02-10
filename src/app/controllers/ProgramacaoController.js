import * as Yup from 'yup'
import Programacao from '../models/Programacao';

import Dia from '../models/Dia';

import User from '../models/User';
import Programa from '../models/Programa';

class ProgramacaoController {

  async show (req, res) {
    try {
      const { id } = req.params;

      const programa = await Programacao.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: Programa,
            as: 'programa'
          }
        ]
      });

      return res.json(programa);
    } catch(err){
      return res.json({error: err.message});

    }
  }

  async index(req, res) {
    try{
      const { id: RadioID} = req.params;

      if(RadioID){
        const programacoesDeSegundaASexta = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: [
                'Segunda-Feira', 
                'Terca-Feira', 
                'Quarta-Feira', 
                'Quinta-Feira', 
                'Sexta-Feira'
              ]
              }
            }
          ]
        });

        const programacoesDeTerca = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: 'Terca-Feira'
              }
            }
          ]
        });
        
        const programacoesDeQuarta = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: 'Quarta-feira'
              }
            }
          ]
        });
        
        const programacoesDeQuinta = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: 'Quinta-Feira'
              }
            }
          ]
        });
        
        const programacoesDeSexta = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: 'Sexta-feira'
              }
            }
          ]
        });
        
        const programacoesDeSabado = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: 'Sabado'
              }
            }
          ]
        });
        
        const programacoesDeDomingo = await Programacao.findAll({
          where:{
            radio_id: RadioID
          },
          include:[
            {
              model: Dia,
              as: 'dia',
              where:{
                nome: 'Domingo'
              }
            }
          ]
        });

        return res.json({
          Segunda:programacoesDeSegundaASexta,
          Terca:programacoesDeTerca,
          Quarta:programacoesDeQuarta,
          Quinta:programacoesDeQuinta,
          Sexta:programacoesDeSexta,
          Sabado:programacoesDeSabado,
          Domingo:programacoesDeDomingo,
        })
      }

      const { userId } = req;

      const userLogado = await User.findByPk(userId);

      if(userLogado.adm){
        const programacoesGerais = await Programacao.findAll({
          include: [
            {
              model: Dia,
              as: 'dia'
            },
            {
              model: Programa,
              as: 'programa'
            }
          ]
        });

        return res.json(programacoesGerais);
      }

      const programacoesGerais = await Programacao.findAll({
        where: {
          radio_id: userLogado.radio_id
        },
        include: [
          {
            model: Dia,
            as: 'dia',
            order: [
              ['nome']
            ]
          },
          {
            model: Programa,
            as: 'programa'
          }
        ]
      });

      return res.json(programacoesGerais);

    } catch(err){
      return res.json({error: err.message})
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      horario: Yup.string().required().min(5),
      radio_id: Yup.number(),
      programa_id: Yup.number().required(),
      dia_id: Yup.number().required(),
      user_id: Yup.number()
    });
    try{

      if(!( await schema.isValid(req.body))) {
        return res.status(400).json({error: 'Verifique os dadaos'})
      }

      const userLogado = await User.findByPk(req.userId);

      const dados = req.body;

      const programacaoExists = await Programacao.findOne({ 
        where: { 
          programa_id: dados.programa_id,
          horario: dados.horario,
          dia_id: dados.dia_id,
          radio_id: userLogado.adm ? dados.radio_id : userLogado.radio_id
        } 
      });

      if(programacaoExists){
        return res.status(400).json({error: 'Programação já existe'});
      }

      const LocutorRequired = await User.findByPk(dados.user_id);
      const ProgramaExsits = await Programa.findByPk(dados.programa_id);

      if( !LocutorRequired || !ProgramaExsits ){
        return res.status(400).json({error: 'Dados, inexistentes'})

      }else if(LocutorRequired.locutor === false){
        return res.status(400).json({error: 'Usuario não é um locutor'})

      }else if( LocutorRequired.radio_id != dados.radio_id ){
        return res.status(400).json({error: 'Usuário não pertence a esta rádio'})

      }

      const programacao = await Programacao.create({
        horario: dados.horario,
        programa_id: dados.programa_id,
        dia_id: dados.dia_id,
        user_id: dados.user_id,
        radio_id: userLogado.adm? dados.radio_id : userLogado.radio_id
      })

      return res.json(programacao)

    } catch (err) {
      return res.json({error: err.message})
    }
  }

  async update(req, res){
    const schema = Yup.object().shape({
      horario: Yup.string().min(5),
      radio_id: Yup.number(),
      programa: Yup.number(),
      dia: Yup.number(),
      user: Yup.number()
    });
    try {

      if(!( await schema.isValid(req.body))) {
        return res.status(400).json({error: 'Verifique os dadaos'})
      }

      const { id: RadioID} = req.params;
      const userLogado = await User.findByPk(req.userId);

      const programacaoEXISTS = await Programacao.findByPk(RadioID);

      const dados = req.body;

      if(dados.horario){
        const programacaoHorario = await Programacao.findOne({ 
          where: { 
            programa: dados.programa,
            horario: dados.horario,
            dia: dados.dia,
            radio_id: userLogado.adm ? dados.radio_id : userLogado.radio_id
          } 
        });
  
        if(programacaoHorario){
          return res.status(400).json({error: 'Programação já existe'});
        }
      }

      const LocutorRequired = await User.findByPk(dados.user);

      if( !LocutorRequired || !programacaoEXISTS ){
        return res.status(400).json({error: 'Dados, inexistentes'})

      }else if(LocutorRequired.locutor === false){
        return res.status(400).json({error: 'Usuario não é um locutor'})

      }else if( LocutorRequired.radio_id != dados.radio_id ){
        return res.status(400).json({error: 'Usuário não pertence a esta rádio'})

      }

      const programacaoAtt = await programacaoEXISTS.update(req.body);

      return res.json(programacaoAtt);
    } catch (err) {
      return res.json({error: err.message})
    }
  }

  async delete(req,res){
    try {
      const { id: RadioID} = req.params;
      const programacaoEXISTS = await Programacao.findByPk(RadioID)

      if(!programacaoEXISTS) {
        return res.status(404).json({error: 'Programação não confere'})
      }

      await programacaoEXISTS.destroy();

      return res.json({ok: true})

    } catch(err){
      return res.json({error: err.message})
    }
  }
}

export default new ProgramacaoController();