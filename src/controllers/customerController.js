import customerService from "../services/customerService.js";

const create = async (req, res) => {
    try {
        const { name, email, password, nomeFantasia, documento, documentoTipo, contato } = req.body;

        if (!name || !email || !password || !nomeFantasia || !documento || !documentoTipo || !contato) {
            return res.status(400).send({
                message: "Preencha todos os campos"
            });
        }

        const customer = await customerService.createService(req.body);

        return res.status(201).send({
            message: "Cliente criado com sucesso",
            customer
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        let { limit, offset, search } = req.query;

        limit = Number(limit) || 10;
        offset = Number(offset) || 0;

        const { results, total } =
            await customerService.findAllService(limit, offset, search);

        if (results.length === 0) {
            return res.status(200).send({
                results: [],
                total: 0
            });
        }

        res.send({ results, total });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await customerService.findByIdService(id);

        if (!customer) {
            return res.status(404).send({
                message: "Cliente não encontrado"
            });
        }

        res.send(customer);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await customerService.updateService(id, req.body);

        res.send({
            message: "Cliente atualizado com sucesso",
            customer: updated
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        await customerService.removeService(id);

        res.send({
            message: "Cliente deletado com sucesso"
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export default {
    create,
    findAll,
    findById,
    update,
    remove
};