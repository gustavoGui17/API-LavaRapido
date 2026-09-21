import agendamentoService from "../services/agendamentoService.js";
import Customer from "../models/Customer.js";

const handleError = (err, res) => {
    console.error("ERRO AGENDAMENTO:", err.message);
    const status = err.statusCode || 500;
    return res.status(status).send({ message: err.message });
};

const create = async (req, res) => {
    try {
        const { lavaRapidoId, veiculoId, data, observacao } = req.body;

        if (!lavaRapidoId || !veiculoId || !data) {
            return res.status(400).send({
                message: "Informe o lava rápido, o veículo e a data do agendamento",
            });
        }

        const agendamento = await agendamentoService.createService({
            clienteId: req.user.id,
            lavaRapidoId,
            veiculoId,
            data: new Date(data),
            observacao,
        });

        return res.status(201).send({
            message: "Agendamento realizado com sucesso",
            agendamento: await agendamentoService.findByIdService(agendamento._id),
        });
    } catch (err) {
        return handleError(err, res);
    }
};

const dashboard = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user.id });

        if (!customer) {
            return res.status(404).send({ message: "Nenhum lava rápido vinculado à sua conta" });
        }

        const { status, inicio, fim } = req.query;

        const agendamentos = await agendamentoService.findAllByLavaRapido(
            customer._id,
            { status, inicio, fim }
        );

        return res.status(200).send({
            lavaRapido: { id: customer._id, nome: customer.nome, nomeFantasia: customer.nomeFantasia },
            results: agendamentos,
            total: agendamentos.length,
        });
    } catch (err) {
        return handleError(err, res);
    }
};

const meusAgendamentos = async (req, res) => {
    try {
        const agendamentos = await agendamentoService.findAllByCliente(req.user.id);

        return res.status(200).send({ results: agendamentos });
    } catch (err) {
        return handleError(err, res);
    }
};

const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const agendamento = await agendamentoService.findByIdService(id);

        if (!agendamento) {
            return res.status(404).send({ message: "Agendamento não encontrado" });
        }

        const dono = agendamento.lavaRapido?.user?.toString() === req.user.id;
        const donoCliente = agendamento.cliente?._id?.toString() === req.user.id;

        if (!dono && !donoCliente && req.user.role !== "admin") {
            return res.status(403).send({ message: "Você não tem permissão para ver este agendamento" });
        }

        return res.status(200).send({ agendamento });
    } catch (err) {
        return handleError(err, res);
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).send({ message: "Informe o novo status" });
        }

        const agendamento = await agendamentoService.updateStatusService(
            id,
            status,
            req.user.id
        );

        return res.status(200).send({
            message: "Agendamento atualizado com sucesso",
            agendamento,
        });
    } catch (err) {
        return handleError(err, res);
    }
};

const cancelar = async (req, res) => {
    try {
        const { id } = req.params;

        await agendamentoService.cancelService(id, req.user.id);

        return res.status(200).send({ message: "Agendamento cancelado com sucesso" });
    } catch (err) {
        return handleError(err, res);
    }
};

export default { create, dashboard, meusAgendamentos, findById, updateStatus, cancelar };