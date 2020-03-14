import Dias from "../app/models/Dia";
import Programacao from "../app/models/Programacao";
import Radio from "../app/models/Radio";
import Banner from "../app/models/Banner";
import Programacao from "../app/models/Programacao";
import Programa from "../app/models/Programa";
import User from "../app/models/User";
import Avatar from "../app/models/FotoLocutor";
import Contato from "../app/models/Contato";
import Top3 from "../app/models/Top3";
import ImagemTop3s from "../app/models/ImagemTop3";
import Contato from "../app/models/Contato";
import Dia from "../app/models/Dia";
import Cidade from "../app/models/Cidade";
import Icon from "../app/models/IconRadio";
import Dias from "../app/models/Dia";

import { Op } from "sequelize";
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

class FormatedHourAndGetInformation {
  async run({ date, radio_id }) {
    try {
      //Pegando o minuto atual do cliente - 45
      const isMinuteAtual = getMinutes(new Date(date));
      const isHourAtual = getHours(new Date(date));

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

      // Hora formatada 18:4 18:0 ...
      const hourFormated = `${hourFormateds}:${minFormateds}`;

      // Buscar por programação quebrada
      const programacaoQuebrada = await Programacao.findOne({
        where: {
          horario: {
            [Op.like]: `%${hourFormated}%`
          },
          dia_id: id
        }
      });

      const ProgramacaoId = programacaoQuebrada ? programacaoQuebrada.id : null;

      if (ProgramacaoId) {
        //Banners e infos da rádio
        const radio = await Radio.findAll({
          where: { id: radio_id },
          include: [
            {
              model: Banner,
              as: "banner1",
              where: { type: 1 },
              limit: 1,
              order: [["id", "DESC"]]
            },
            {
              model: Banner,
              as: "banner2",
              where: { type: 2 },
              limit: 1,
              order: [["id", "DESC"]]
            },
            {
              model: Programacao,
              as: "programacao",
              limit: 1,
              where: {
                id: ProgramacaoId,
                dia_id: id
              },
              include: [
                {
                  model: User,
                  as: "locutor",
                  attributes: ["id", "name", "email"],
                  include: [
                    {
                      model: Avatar,
                      as: "avatar"
                    }
                  ]
                },
                {
                  model: Programa,
                  as: "programa"
                }
              ]
            },
            {
              model: Top3,
              as: "top3",
              limit: 3,
              order: [["id", "DESC"]],
              include: [
                {
                  model: ImagemTop3s,
                  as: "image"
                }
              ]
            },
            {
              model: Programacao,
              as: "allprogramacao",
              include: [
                {
                  model: Dia,
                  as: "dia"
                }
              ]
            },
            {
              model: Contato,
              as: "contato",
              limit: 3,
              order: [["id", "DESC"]]
            },
            {
              model: Cidade,
              as: "cidade",
              attributes: ["nome"]
            },
            {
              model: Icon,
              as: "icon"
            }
          ]
        });

        return radio;
      } else {
        const hourFormated2 = `${hourFormateds}:00`;
        //Banners e infos da rádio
        const radio = await Radio.findAll({
          where: { id: radio_id },
          include: [
            {
              model: Banner,
              as: "banner1",
              where: { type: 1 },
              limit: 1,
              order: [["id", "DESC"]]
            },
            {
              model: Banner,
              as: "banner2",
              where: { type: 2 },
              limit: 1,
              order: [["id", "DESC"]]
            },
            {
              model: Programacao,
              as: "programacao",
              limit: 1,
              where: {
                horario: {
                  [Op.like]: `%${hourFormated2}%`
                },
                dia_id: id
              },
              include: [
                {
                  model: User,
                  as: "locutor",
                  attributes: ["id", "name", "email"],
                  include: [
                    {
                      model: Avatar,
                      as: "avatar"
                    }
                  ]
                },
                {
                  model: Programa,
                  as: "programa"
                }
              ]
            },
            {
              model: Top3,
              as: "top3",
              limit: 3,
              order: [["id", "DESC"]],
              include: [
                {
                  model: ImagemTop3s,
                  as: "image"
                }
              ]
            },
            {
              model: Programacao,
              as: "allprogramacao",
              include: [
                {
                  model: Dia,
                  as: "dia"
                }
              ]
            },
            {
              model: Contato,
              as: "contato",
              limit: 3,
              order: [["id", "DESC"]]
            },
            {
              model: Cidade,
              as: "cidade",
              attributes: ["nome"]
            },
            {
              model: Icon,
              as: "icon"
            }
          ]
        });

        return radio;
      }
    } catch (err) {
      return err.message;
    }
  }
}

export default new FormatedHourAndGetInformation();
