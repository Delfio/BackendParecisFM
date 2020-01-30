import * as Yup from 'yup';
import Pedidos from '../models/Pedidos';

import Notifications from '../schemas/notifications'

class PedidosController {
  async store(req, res) {
    const schema = Yup.object().shape({
      musica: Yup.string().required('Informe o nome da música'),
      artista: Yup.string(),
      data: Yup.date().default(function() {
        return new Date();
      })
    })

    try {

      if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: 'Erro, verifique os dados'})
      }

      const { musica, artista, data } = req.body;
      const { id } = req.params;

      /**
      * Create a notification in MySQL
      */
      const notificacao = await Pedidos.create({
        musica,
        artista,
        data,
        radio_id: id
      });

      /**
      * Notify locutor with a radio dashboard
      */
      
      await Notifications.create({
        content: 'Novo pedido de música: xxxxxxxxxxxxx',
        radio: id
      })

      return res.json(notificacao);
    }catch (err) {
        return res.status(500).json({error: err.message})
    }

  } 
}


export default new PedidosController();