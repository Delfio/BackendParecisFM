import * as Yup from 'yup';
import Pedidos from '../models/Pedidos';
import {parseISO, format, isBefore, startOfHour} from 'date-fns';
import getHours from 'date-fns/getHours'
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
      const { id } = req.params;

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