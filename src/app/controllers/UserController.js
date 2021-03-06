import * as Yup from "yup";
import User from "../models/User";
import Radio from "../models/Radio";
import Avatar from "../models/FotoLocutor";

class UserController {
  async show(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        attributes: ["name", "email", "locutor", "telefone", "cidade", "cpf"],
        where: {
          id: id
        },
        include: [
          {
            model: Radio,
            as: "radio",
            attributes: ["name"]
          },
          {
            model: Avatar,
            as: "avatar"
          }
        ]
      });

      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async index(req, res) {
    try {
      const { userId } = req;
      const userLogado = await User.findByPk(userId);

      if (userLogado.adm) {
        const adms = await User.findAll({
          attributes: ["id", "name", "email", "locutor", "adm"],
          where: {
            adm: true
          },
          include: [
            {
              model: Radio,
              as: "radio",
              attributes: ["name"]
            },
            {
              model: Avatar,
              as: "avatar"
            }
          ]
        });
        const locutor = await User.findAll({
          attributes: ["id", "name", "email", "locutor", "adm"],
          where: {
            adm: false
          },
          include: [
            {
              model: Radio,
              as: "radio",
              attributes: ["name"]
            },
            {
              model: Avatar,
              as: "avatar"
            }
          ]
        });
        return res.json({
          adms: adms,
          locutores: locutor
        });
      }

      const users = await User.findAll({
        attributes: ["id", "name", "email", "locutor"],
        where: {
          radio_id: userLogado.radio_id
        },
        include: [
          {
            model: Radio,
            as: "radio",
            attributes: ["name"]
          },
          {
            model: Avatar,
            as: "avatar"
          }
        ]
      });

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required("nome é obrigatório"),
      email: Yup.string()
        .email("insira um email válido")
        .required("O email é obrigatório"),
      cpf: Yup.string().required(),
      password: Yup.string()
        .required("Senha é obrigatória")
        .min(6, "Minimo de 6 digitos"),
      locutor: Yup.boolean(),
      cidade: Yup.string(),
      telefone: Yup.string()
        .min(9)
        .max(12),
      adm: Yup.boolean()
    });

    try {
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Erro, verifique os dados" });
      }

      const userExists = await User.findOne({
        where: { email: req.body.email }
      });

      if (userExists) {
        return res.status(400).json({ error: "Email já em uso" });
      }

      const RadioRequest = await Radio.findByPk(req.body.radio_id);

      if (!RadioRequest) {
        return res.status(400).json({ error: "Radio não existe" });
      }

      const { id, name, email, radio, locutor } = await User.create({
        name: req.body.name,
        email: req.body.email,
        radio_id: req.body.radio_id,
        password: req.body.password,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        cidade: req.body.cidade,
        adm: req.body.adm,
        locutor: req.body.locutor ? true : false
      });

      return res.json({
        id,
        name,
        email,
        radio,
        locutor
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      telefone: Yup.string()
        .min(8)
        .max(11),
      cidade: Yup.string(),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
      radio_id: Yup.number(),

      cfp_request: Yup.string()
        .min(11)
        .max(12),

      cpf_password: Yup.string()
    });

    try {
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Erro, verifique os dados" });
      }

      const { userId } = req;

      const {
        email,
        oldPassword,
        password,
        cfp_request,
        cpf_password,
        radio_id
      } = req.body;
      const { id } = req.params;

      //Restar a senha pelo CPF 'Esqueci minha senha'
      if (id && cfp_request && !userId) {
        const userRequest = await User.findOne({
          where: {
            cpf: cfp_request
          }
        });

        if (!userRequest) {
          return res.status(401).json({ error: "CPF INVÁLIDO" });
        }

        await userRequest.update({
          password: cpf_password
        });

        return res.json(userRequest);
      } else if (id && !cfp_request) {
        return res.status(400).json({ error: "Tem algo de errado ai" });
      } else if (!id && cfp_request) {
        return res.status(400).json({ error: "Tem algo de errado ai pacero" });
      }

      const user = await User.findByPk(userId);
      
      //Admin mudando as infos do usuário
      if (id && user.adm && cfp_request) {
        const userRequest = await User.findOne({
          where: {
            cpf: cfp_request
          }
        });

        if (!userRequest) {
          return res.status(401).json({ error: "CPF INVÁLIDO" });
        }

        await userRequest.update(req.body);
        
        return res.json(userRequest)
      }

      //User resetando a senha
      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).json({ error: "Email já em uso" });
        }
      }

      if (!oldPassword && password) {
        return res.status(401).json({ error: "Senha antiga não confere" });
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: "Senha não confere" });
      }

      const userRequest = await user.update(req.body);

      const userRetornar = await User.findOne({
        where: {
          id: userRequest.id
        },
        include: [
          {
            model: Avatar,
            as: "avatar"
          }
        ]
      });
      return res.json(userRetornar);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req;
      const { user_id } = req.params;

      const userLogado = await User.findOne({
        where: {
          id: userId
        }
      });

      if (user_id && userLogado.adm) {
        const userRequest = await User.findOne({
          where: {
            id: user_id
          }
        });

        if (!userRequest) {
          return res.status(404).json({ error: "User not found" });
        }

        await userRequest.destroy();

        await userRequest.save();

        return res.json({ ok: true });
      } else if (user_id && !userLogado.adm) {
        return res.status(401).json({ error: "Não autorizado" });
      } else if (!user_id) {
        await userLogado.destroy();
        await userLogado.save();

        return res.json({ ok: true });
      }

      return res.json({ wtfmano: "como vc chegou aqui" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

export default new UserController();
