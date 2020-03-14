import Dias from "../app/models/Dia";
import Programacao from "../app/models/Programacao";
import Radio from "../app/models/Radio";

import {
  parseISO,
  isBefore,
  getMinutes,
  getHours,
  isFriday, //sexta
  isMonday, //segunda
  isSaturday, //sábado
  isSunday, //Domingo
  isThursday, //quinta
  isTuesday, //terça
  isWednesday //quarta
} from "date-fns";

import { Op } from "sequelize";

class SendRequestMusic {
  async run({ radio_id, date }) {
    // Formatando para a notificação
    const data = new Date(date);

    //Pegando o minuto atual do cliente - 45
    const isMinuteAtual = getMinutes(data);
    const isHourAtual = getHours(data);

    const hours = `${isHourAtual}`; //Variavel para avaliar as horas
    const minuted = `${isMinuteAtual}`; //Variavel para avaliar os minutos

    // Formatando a hora para duas casas - caso seja necessário
    const isHourFormated = () => {
      if (hours.length == 1) {
        const x = `0${isHourAtual}`;
        return x;
      } else if (hours.length == 2) {
        return isHourAtual;
      }
    };
    //Pegando o valor da hora formatada
    const hourFormateds = isHourFormated();

    // Formatando os minutos para 2 casas
    const isMinutedFormats = () => {
      if (minuted.length == 1) {
        return isMinuteAtual;
      } else {
        if (minuted >= 10 && minuted <= 30) {
          const x = "2";
          return x;
        } else if (minuted >= 30 && minuted <= 40) {
          const x = "3";
          return x;
        } else if (minuted >= 40 && minuted <= 58) {
          const x = "4";
          return x;
        }
      }
    };
    const minFormateds = isMinutedFormats();

    //Verificando qual dia esta data pertence
    const dia = () => {
      if (isMonday(parseISO(date))) {
        return "Segunda-Feira";
      } else if (isTuesday(parseISO(date))) {
        return "Terça-Feira";
      } else if (isWednesday(parseISO(date))) {
        return "Quarta-Feira";
      } else if (isThursday(parseISO(date))) {
        return "Quinta-Feira";
      } else if (isFriday(parseISO(date))) {
        return "Sexta-Feira";
      } else if (isSaturday(parseISO(date))) {
        return "Sabado";
      } else if (isSunday(parseISO(date))) {
        return "Domingo";
      }
    };
    //executando a função e pegando seu valor
    const diaAtual = dia();

    //Pegar o id do dia atual
    const { id } = await Dias.findOne({
      where: { nome: diaAtual }
    });

    // Hora formatada 18:45 18:10
    //Pegando programação de horario quebrado
    const hourFormated = `${hourFormateds}:${minFormateds}`;

    const programacao = await Programacao.findOne({
      where: {
        horario: {
          [Op.like]: `%${hourFormated}%`
        }
      },
      include: [
        {
          model: Dias,
          as: "dia",
          where: { id: id }
        },
        {
          model: Radio,
          as: "radio",
          where: { id: radio_id }
        }
      ]
    });

    //Se existir programacao com horario quebrado...
    if (programacao) {
      return programacao;
    } else {
      //Se não existir programação com o horário quebrado...

      // Hora formatada 18:45 18:10 ...
      const hourFormated2 = `${hourFormateds}:00`;

      const programacao2 = await Programacao.findOne({
        where: {
          horario: {
            [Op.like]: `%${hourFormated2}%`
          }
        },
        include: [
          {
            model: Dias,
            as: "dia",
            where: { id: id }
          },
          {
            model: Radio,
            as: "radio",
            where: { id: radio_id }
          }
        ]
      });

      return programacao2;
    }
  }
}

export default new SendRequestMusic();
