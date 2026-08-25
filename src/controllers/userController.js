import userService from "../services/userService.js"

const create = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Preencha todos os campos obrigatórios" });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "A senha precisa ter no mínimo 6 caracteres" });
        }

        const user = await userService.createService(req.body);

        return res.status(201).send({
            message: "Usuário criado com sucesso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService();

        if (users.length === 0) {
            return res.status(400).send({ message: "Nenhum usuário cadastrado" });
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
            res.status(400).send({ message: "Preencha pelo menos um campo para editar" });
            return res.status(400)
        }

        const { id, user } = req;

        await userService.updateService(
            id,
            name,
            email,
            password
        )

        res.send({ message: "Usuário atualizado com sucesso" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

};

const remove = async (req, res) => {
    try {
        const { id } = req;

        await userService.removeService(id);

        res.send({ message: "Usuário removido com sucesso" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export default { create, findAll, findById, update, remove };