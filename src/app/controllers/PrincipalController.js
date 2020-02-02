import Radio from '../models/Radio';
import Banner from '../models/Banner';
import Programacao from '../models/Programacao';

class PrincipalController {

  async index(req, res){

    const { id: IdRadio } = req.params;

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
        }
      ]
    })

    return res.json(radio)
  }

}

export default new PrincipalController();