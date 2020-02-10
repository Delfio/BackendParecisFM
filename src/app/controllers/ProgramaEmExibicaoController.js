import * as Yup from 'yup'
import Exibicao from '../models/ProgramaEmExibicao'
import Programa from '../models/Programa'
import User from '../models/User'
import Radio from '../models/Radio'

import Title from '../models/TitoloProgramaEmExibicao'

class ProgramaEmExibicao {

  async index(req,res) {
    try {
      const {id} = req.params

      const programacoes = await Title.findAll({
        order:[
          ['id', 'asc']
        ],
        include: [
          {
            model: Exibicao,
            as: 'programa',
            where: {
              radio_id: id
            },
            include: [
              {
                model: Programa,
                as: 'programa',
                order:[
                  ['horario', 'asc']
                ],
              }
            ]
          }
        ]
      });

      return res.json(programacoes)
    } catch(err){
      return res.json(err.message)
    }
  }

  async store(req, res){
    const schema = Yup.object().shape({
      horario: Yup.string().required(),
      obs: Yup.boolean(),
      programa_id: Yup.number().required(),
      title_id: Yup.number().required(),
    })
    try {
      if(!(await schema.isValid(req.body))){
        return res.status(401).json({error: 'verifique seus dados'})
      }
      
      const {userId} = req;
      const {id : RadioID} = req.params
      const { programa_id } = req.body
      const { title_id } = req.body

      const userLogado = await User.findByPk(userId);
      const radioRequest = await Radio.findByPk(RadioID);
      const programaRequest = await Programa.findByPk(programa_id);
      const TitleRequest = await Title.findByPk(title_id)

      if(!radioRequest || !programaRequest || !TitleRequest){
        return res.status(404).json({error: 'Conteudo NOT FOUND'})

      }else if(userLogado.radio_id !== radioRequest.id && !userLogado.adm){
        return res.status(403).json({error: 'Não autorizado'})
      }

      const programaEmExibicao = await Exibicao.create({
        ...req.body,
        titulos_programacoes_em_exibicao_id: req.body.title_id,
        radio_id: RadioID
      })

      return res.json(programaEmExibicao)
    } catch(err){
      return res.json({error: err.message})
    }
  }

}

export default new ProgramaEmExibicao();