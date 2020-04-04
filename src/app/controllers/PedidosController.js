import * as Yup from "yup";
import Pedidos from "../models/Pedidos";
import Programacao from "../models/Programacao";
import Programa from "../models/Programa";
import Radio from "../models/Radio";
import { Op } from "sequelize";
import Notifications from "../schemas/notifications";
import { findUser, sendNotification } from "../../websocket";

import { format, getHours, parseISO } from "date-fns";
import pt from "date-fns/locale/pt";
import User from "../models/User";

import ServiceSendRequestMusic from "../../services/ServiceSendRequestMusics";

class PedidosController {
  async index(req, res) {
    try {
      const { radio_id } = req.params;
      const { userId } = req;

      const RadioRequest = await Radio.findByPk(radio_id);
      const userLogado = await User.findByPk(userId);

      if (userLogado.radio_id != radio_id) {
        return res.status(404).json({ error: "Não permitido" });
      }
      //Admin
      if (!radio_id && userLogado.adm) {
        return res.json({ ok: true });
      }
      if (!RadioRequest) {
        return res.status(404).json({ error: "Not found" });
      }

      const ultimosPedidos = await Notifications.find()
        .where({radio: radio_id})
        .limit(5)
        .sort({createdAt: 'desc'})

      //User Normal

      return res.json(ultimosPedidos);
    } catch (err) {
      return res.json(err.message);
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required("Informe o nome"),
      idade: Yup.string()
        .required("Informe o nome")
        .max(2, "Máximo de 2 caracteres"),
      telefone: Yup.string()
        .required("Informe o seu telefone")
        .min(9, "Minimo de 9 numeros")
        .max(11, "Maximo de 11 numeros"),
      musica: Yup.string().required("Informe o nome da música"),
      artista: Yup.string().required("Informe o nome da música"),
      data: Yup.date().required(),
      genero: Yup.string().required() // da pessoa kkkk até eu pensei que fosse da música
      //wtf mas sou eu que to fazendo.. pq eu to escrevendo pra mim mesmo bixo?
    });

    try {
      const { id: RadioID, pedidoId } = req.params;
      const { data_id } = req.body;

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Erro, verifique os dados" });
      }

      const { nome, idade, telefone, musica, artista, data, genero } = req.body;

      // Formatando para a notificação
      const dateFormated = format(
        parseISO(data),
        "'Dia' dd 'de' MMMM', às ' HH:mm'h'",
        { locale: pt }
      );

      // Formatando apra pegar a hora
      const hourUser = getHours(new Date(data));

      const RequestMusic = await ServiceSendRequestMusic.run({
        date: data,
        radio_id: RadioID
      });

      // Se não tiver programação - criar mesmo assim pq o cliente mandou
      if (!RequestMusic) {

        const dateNotification = () => {
          const date = new Date(data);
          const diaRequisitado = date.getDay();

          switch (diaRequisitado) {
            case 0:
              return "Domingo"
              break;
            case 1:
              return "Segunda-Feira"
              break;
            case 2:
              return "Terça-Feira"
              break;
            case 3:
              return "Quarta-Feira";
              break;
            case 4:
              return "Quinta-Feira";
            case 5:
              return "Sexta-Feira";
            case 6:
              return "Sábado"
            default:
              break;
          }
        }
        const message = `Novo pedido de ${nome} do telefone: ${telefone}. Musica: "${musica}", do artista: ${artista}`;

        const dataParaMessagem = await dateNotification();

        await Notifications.create({
          content: message,
          hora: hourUser,
          dia:dataParaMessagem,
          programa: 0,
          radio: RadioID
        });
        
        // Devolver resposta de erro, pois o front já trata
        return res.status(403).json({ error: "Sem programação" });
      }

      //Pegando o dia para criar a notificação no mongo
      const valor = RequestMusic.dia.nome;

      const idProgramacao = RequestMusic.id;

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

      const message = `Novo pedido de ${nome} do telefone: ${telefone}. Musica: "${musica}", do artista: ${artista}, as: ${dateFormated}`;

      // console.log(message);

      await Notifications.create({
        content: message,
        hora: hourUser,
        dia: valor,
        programa: idProgramacao,
        radio: RadioID
      });

      //Enviando notificação via socket.io
      const sendMessage = findUser(RadioID);
      // console.log(sendMessage);

      sendNotification(sendMessage, "Novo-Pedido", message);

      return res.json(notificacao);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new PedidosController();
