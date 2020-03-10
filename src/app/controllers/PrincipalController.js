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
