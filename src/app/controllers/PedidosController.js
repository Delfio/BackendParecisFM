import * as Yup from 'yup';
import Pedidos from '../models/Pedidos';

import Programacao from '../models/Programacao';

import Dias from '../models/Dia';

import Top3 from '../models/Top3';

import Radio from '../models/Radio';

import { Op } from 'sequelize'
import Notifications from '../schemas/notifications'

import {
  parseISO, 
  format, 
  isBefore, 
  startOfHour, 
  getHours,
  isFriday, //sexta
  isMonday,  //segunda
  isSaturday, //sábado
  isSunday, //Domingo
  isThursday, //quinta
  isTuesday, //terça
  isWednesday //quarta
} from 'date-fns';
import pt from 'date-fns/locale/pt';
 

class PedidosController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required('Informe o nome'),
      idade: Yup.string().required('Informe o nome')
        .max(2, 'Máximo de 2 caracteres'),
      telefone: Yup.string().required('Informe o seu telefone')
        .min(9, 'Minimo de 9 numeros')
        .max(11, 'Maximo de 11 numeros'),
      musica: Yup.string().required('Informe o nome da música'),
      artista: Yup.string().required('Informe o nome da música'),
      data: Yup.date().required(),
      genero: Yup.string().required()
    })

    try {
      const { id : RadioID, pedidoId } = req.params;
      const {data_id} = req.body

      console.log(data_id);

      if(pedidoId){

        const pedidoExists = await Top3.findByPk(pedidoId);

        if(!pedidoExists) {
          return res.status(404).json({error: 'Não existe '})
        }          
        // Formatando para a notificação

        const data = new Date(data_id)
        
        const dateFormated = format(
          data,
          "'Dia' dd 'de' MMMM', às ' HH:mm'h'",
          { locale: pt }
        );

        //Pegando a hora atual - 18
        const isHourAtual = getHours(new Date(data_id));

        // Formatando ela para 18:00
        const isHourFormated = `${isHourAtual}:00`

        //Verificando qual dia esta data_id pertence
        const dia = () => {
          if( isMonday(parseISO(data_id))){
            return "Segunda-Feira";
            
          }else if(isTuesday(parseISO(data_id))){
            return "Terça-Feira";
    
          }else if(isWednesday(parseISO(data_id))){
            return "Quarta-Feira";

          }else if(isThursday(parseISO(data_id))){
            return "Quinta-Feira";

          }else if(isFriday(parseISO(data_id))){
            return "Sexta-Feita";

          }else if(isSaturday(parseISO(data_id))){
            return "Sabado";
            
          }else if(isSunday(parseISO(data_id))){
            return "Domingo";
            
          }
        }
        //executando a função e pegando seu valor
        const valor = dia();

        const programacao = await Programacao.findAll({
          where: { 
            horario: {
              [Op.like]: `%${isHourFormated}%`
            }
          },
          include: [
            {
              model: Dias,
              as: 'dia',
              where: { "nome": valor }
            },
            {
              model: Radio,
              as: 'radio',
              where: { "id": RadioID }
            }
          ],
        });

        if(programacao.length < 1) {
          return res.status(403).json({error: 'Sem programação'})
        }
  
        const idProgramacao = programacao[0].id;

        /**
        * Create a notification in MySQL
        */
        const notificacao = await Pedidos.create({
          nome: "xxxxx",
          idade: "xxxx",
          telefone: "xxxx",
          musica: pedidoExists.musica,
          artista: pedidoExists.artista,
          genero: "xxxxx",
          data: data_id,
          radio_id: RadioID,
          programacao_id: idProgramacao
        });

        
        const message = `Novo pedido dos TOP3. Musica: "${pedidoExists.musica}", do artista: ${pedidoExists.artista}, as: ${dateFormated}`

        // console.log(message);
        
        await Notifications.create({
          content: message,
          hora: isHourFormated,
          dia: valor,
          programa: idProgramacao,
          radio: RadioID
        })

        return res.json(notificacao);
      }

      //metodo 2
      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const { nome, idade, telefone, musica, artista, data, genero } = req.body;

      //Verificando se a data e hora já passou
      // if( isBefore(parseISO(data), new Date())){
      //   return res.status(400).json({error: 'Data Anterior a atual'})
      // }

      // Formatando para a notificação
      const dateFormated = format(
        parseISO(data),
        "'Dia' dd 'de' MMMM', às ' HH:mm'h'",
        { locale: pt }
      );

      //Pegando a hora atual - 18
      const isHourAtual = getHours(new Date(data));

      // Formatando ela para 18:00
      const isHourFormated = `${isHourAtual}:00`

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
      const valor = dia();

      //Programação que vai estar tocando neste horario
      const programacao = await Programacao.findAll({
        where: { 
          horario: {
            [Op.like]: `%${isHourFormated}%`
          }
        },
        include: [
          {
            model: Dias,
            as: 'dia',
            where: { "nome": valor }
          },
          {
            model: Radio,
            as: 'radio',
            where: { "id": RadioID }
          }
        ],
      });

      if(programacao.length < 1) {
        return res.status(403).json({error: 'Sem programação'})
      }

      const idProgramacao = programacao[0].id;

      /**
      * Create a notification in MySQL
      */
      const notificacao = await Pedidos.create({
        nome,
        idade,
        telefone,
        musica,
        artista,
        genero,
        data: data,
        radio_id: RadioID,
        programacao_id: idProgramacao
      });

      /**
      * Notify locutor with a radio dashboard
      */

      const message = `Novo pedido de ${nome} do telefone: ${telefone}. Musica: "${musica}", do artista: ${artista}, as: ${dateFormated}`

      // console.log(message);
      
      await Notifications.create({
        content: message,
        hora: isHourFormated,
        dia: valor,
        programa: idProgramacao,
        radio: RadioID
      })

      return res.json(notificacao)
    }catch (err) {
        return res.status(500).json({error: err.message})
    }

  } 
}


export default new PedidosController();