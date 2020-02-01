import * as Yup from 'yup';
import Pedidos from '../models/Pedidos';

import Programacao from '../models/Programacao';

import Dias from '../models/Dia';

import Radio from '../models/Radio';

import { Op } from 'sequelize'

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
import { zonedTimeToUtc } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
 
import Notifications from '../schemas/notifications'

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
      data: Yup.date().required()
    })

    try {

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const { nome, idade, telefone, musica, artista, data } = req.body;
      const { id : RadioID } = req.params;

      //Verificando se a data e hora já passou
      if( isBefore(parseISO(data), new Date())){
        return res.status(400).json({error: 'Data Anterior a atual'})
      }

      // Formatando para a notificação
      const dateFormated =  format(
        parseISO(data),
        "'Dia' dd 'de' MMMM', às ' HH:mm'h'",
        { locale: pt }
      );

      const isHourAtual = getHours(new Date(data));

      const isHourFormated = `${isHourAtual}:00`

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
      })

      console.log(programacao);

      // console.log(isWednesday(parseISO(data)));
      
      // Hora inicial - 14:00 - 15:00
      const hourStart = startOfHour(parseISO(data))

      if( isBefore(hourStart, new Date())){
        return res.status(400).json({error: 'Data Inválida'})
      }

      /**
      * Create a notification in MySQL
      */
      // const notificacao = await Pedidos.create({
      //   nome,
      //   idade,
      //   telefone,
      //   musica,
      //   artista,
      //   data: data,
      //   radio_id: id
      // });

      // const message = `Novo pedido de ${nome} do telefone: ${telefone}. Musica: "${musica}", do artista: ${artista}, ${formattedDate}`

      // console.log(message);

      /**
      * Notify locutor with a radio dashboard
      */
      
      // await Notifications.create({
      //   content: 'Novo pedido de música: xxxxxxxxxxxxx',
      //   radio: id
      // })

      // return res.json(notificacao);
      return res.json({ok: true})
    }catch (err) {
        return res.status(500).json({error: err.message})
    }

  } 
}


export default new PedidosController();