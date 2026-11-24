import userService from "../services/userService.js"
import { publicUser } from "./authController.js"

const create = async (req, res) => {
    try {
        const { name, nome, email, password } = req.body;

        if ((!name && !nome) || !email || !password) {
            return res.status(400).send({ message: "Preencha todos os campos obrigatórios" });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "A senha precisa ter no mínimo 6 caracteres" });
        }

        const user = await userService.createService(req.body);

        return res.status(201).send({
            message: "Conta criada com sucesso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).send({ message: "Este e-mail já está cadastrado" });
        }
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
        const { name, email, password, telefone, endereco, location } = req.body;

        const temAlteracao = [name, email, password, telefone, endereco, location]
            .some((valor) => valor !== undefined && valor !== null && valor !== "");

        if (!temAlteracao) {
            return res.status(400).send({ message: "Preencha pelo menos um campo para editar" });
        }

        if (password && String(password).length < 6) {
            return res.status(400).send({ message: "A senha precisa ter no mínimo 6 caracteres" });
        }

        if (email !== undefined && !String(email).trim()) {
            return res.status(400).send({ message: "Informe um e-mail válido" });
        }

        const dados = {};
        if (name !== undefined) dados.name = String(name).trim();
        if (email !== undefined) dados.email = String(email).trim().toLowerCase();
        if (telefone !== undefined) dados.telefone = String(telefone).trim();
        if (endereco !== undefined) dados.endereco = endereco;
        if (location !== undefined) dados.location = location;
        if (password) dados.password = password;

        const user = await userService.updateService(req.params.id, dados);

        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        return res.send({
            message: "Usuário atualizado com sucesso",
            user: publicUser(user),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).send({ message: "Este e-mail já está cadastrado" });
        }
        console.error("ERRO UPDATE USER:", err);
        return res.status(500).send({ message: err.message });
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