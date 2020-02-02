import Radio from '../models/Radio';
import Banner from '../models/Banner';
import Programacao from '../models/Programacao';
import Dias from '../models/Dia';
import User from '../models/User';

import { Op } from 'sequelize'

import {
  parseISO, 
  isBefore,  
  getHours,
  isFriday, //sexta
  isMonday,  //segunda
  isSaturday, //sábado
  isSunday, //Domingo
  isThursday, //quinta
  isTuesday, //terça
  isWednesday //quarta
} from 'date-fns';

class PrincipalController {

  async index(req, res){

    const { id: IdRadio } = req.params;

    const { data } = req.query

    // if( isBefore(parseISO(data), new Date())){
    //   return res.status(400).json({error: 'Data Anterior a atual'})
    // }

    //Pegando a hora atual do cliente - 18
    const isHourAtual = getHours(new Date(data));

    const qtdNumeros = `${isHourAtual}`;
    
    // // Formatando ela para 18:00
    const isHourFormated = () =>{
      if(qtdNumeros.length == 1){
        const x  = `0${isHourAtual}:00`;
        return x;
  
      }else if(qtdNumeros.length == 2){
        const x  = `${isHourAtual}:00`;
        return x;
  
      }
    }
    const horanessaporra = isHourFormated();

    //Verificando qual dia esta data pertence
    const dia = () => {
      if( isMonday(parseISO(data))){
        return "Segunda-Feira";
        
      }else if(isTuesday(parseISO(data))){
        return "Terça-Feira";

      }else if(isWednesday(parseISO(data))){
        return "Quarta-Feira";

      }else if(isThursday(parseISO(data))){
        return "Quinta-Feira";

      }else if(isFriday(parseISO(data))){
        return "Sexta-Feita";

      }else if(isSaturday(parseISO(data))){
        return "Sabado";
        
      }else if(isSunday(parseISO(data))){
        return "Domingo";
        
      }
    }
    //executando a função e pegando seu valor
    const diaAtual = dia();

    //Pegar o id do dia atual
    const {id} = await Dias.findOne({nome: diaAtual})

    //Banners e infos da rádio
    const radio = await Radio.findAll({
      where:{ id: IdRadio },
      include: [
        {
          model: Banner,
          as: 'banner1',
          where:{ type: 1 },
          limit: 1,
          order:[
            ['id', 'DESC']
          ],
        },
        {
          model: Banner,
          as: 'banner2',
          where:{ type: 2 },
          limit: 1,
          order:[
            ['id', 'DESC']
          ],
        },
        {
          model: Programacao,
          as: 'programacao',
          limit: 1,
          where:{ 
            horario: {
              [Op.like]: `%${horanessaporra}%`
            },
            dia_id: id
          },
          include: [
            {
              model: User,
              as: 'locutor',
              attributes: [ 'name', 'email' ]
            }
          ]
        }
      ]
    });

    return res.json(radio)
  }

}

export default new PrincipalController();