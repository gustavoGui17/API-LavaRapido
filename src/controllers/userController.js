import userService from "../services/userService.js"

const create = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Por favor preencher todos os campos" });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "A senha precisa ter no mínimo 6 caracteres" });
        }

        const user = await userService.createService(req.body)

        if (!user) {
            return res.status(400).send({ message: "Erro na criacao do usuario" });
        }

        res.status(201).send({
            message: "Usuario criado com suceso",
            user: {
                id: user._id,
                name,
                email,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService();

        if (users.length === 0) {
            return res.status(400).send({ message: "NãO tem usuarios cadastrados" });
        }

        res.send(users)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

};

const findById = async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const update = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name && !email && !password) {
            res.status(400).send({ message: "Por favor prencher um campo para editar" });
        }

        const { id, user } = req;

        await userService.updateService(
            id,
            name,
            email,
            password
        )

        res.send({ message: "Usuario alterado com sucesso" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

};

const remove = async (req, res) => {
    try {
        const { id } = req;

        await userService.removeService(id);

        res.send({ message: "Usuario deletado com sucesso" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export default { create, findAll, findById, update, remove };