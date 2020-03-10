import Radio from "../models/Radio";
import Banner from "../models/Banner";
import Programacao from "../models/Programacao";
import Programa from "../models/Programa";
import Dias from "../models/Dia";
import User from "../models/User";
import Avatar from "../models/FotoLocutor";
import Contato from "../models/Contato";
import Top3 from "../models/Top3";
import ImagemTop3s from "../models/ImagemTop3";
import Dia from "../models/Dia";
import Cidade from "../models/Cidade";
import Icon from "../models/IconRadio";

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

import ServiceFormateHour from "../../services/FormatHourAndGetInformation";

class PrincipalController {
  async index(req, res) {
    try {
      const { id: IdRadio } = req.params;

      const { data } = req.query;

      // if( isBefore(parseISO(data), new Date())){
      //   return res.status(400).json({error: 'Data Anterior a atual'})
      // }

      const radio = await ServiceFormateHour.run({
        date: data,
        radio_id: IdRadio
      });

      return res.json(radio);
    } catch (err) {
      return res.json({ error: err.message });
    }
  }
}

export default new PrincipalController();
