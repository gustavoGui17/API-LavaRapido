import Agendamento from "../models/Agendamento.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";
import Veiculo from "../models/Veiculo.js";
import VeiculoCliente from "../models/VeiculoCliente.js";

const createService = async ({ clienteId, lavaRapidoId, veiculoId, data, observacao }) => {
    const [customer, veiculo, cliente] = await Promise.all([
        Customer.findById(lavaRapidoId),
        VeiculoCliente.findById(veiculoId),
        User.findById(clienteId),
    ]);

    if (!customer) {
        const err = new Error("Lava rápido não encontrado");
        err.statusCode = 404;
        throw err;
    }

    if (customer.status !== "ativo") {
        const err = new Error("Este lava rápido está inativo no momento");
        err.statusCode = 400;
        throw err;
    }

    if (!veiculo || veiculo.user.toString() !== String(clienteId)) {
        const err = new Error("Veículo inválido");
        err.statusCode = 400;
        throw err;
    }

    const agendamento = await Agendamento.create({
        cliente: clienteId,
        lavaRapido: lavaRapidoId,
        veiculo: veiculoId,
        data,
        observacao,
    });

    const veiculoFila = await Veiculo.create({
        placa: veiculo.placa,
        modelo: veiculo.modelo,
        cor: veiculo.cor,
        tipoLavagem: "simples",
        nomeCliente: cliente?.name || "Cliente",
        contato: cliente?.telefone || cliente?.email || "",
        usuario: customer.user,
        customer: customer._id,
        agendamento: agendamento._id,
        entryDate: data,
        status: "pendente",
    });

    agendamento.veiculoFila = veiculoFila._id;
    await agendamento.save();

    return agendamento;
};

const findAllByLavaRapido = async (customerId, { status, inicio, fim }) => {
    const filtro = { lavaRapido: customerId };

    if (status) {
        filtro.status = status;
    } else {
        filtro.status = { $in: ["agendado", "confirmado"] };
    }

    if (inicio || fim) {
        filtro.data = {};
        if (inicio) filtro.data.$gte = inicio;
        if (fim) filtro.data.$lte = fim;
    }

    return Agendamento.find(filtro)
        .populate("cliente", "name email telefone endereco location")
        .populate("veiculo")
        .populate("lavaRapido", "nome nomeFantasia")
        .sort({ data: 1 });
};

const findAllByCliente = (clienteId) =>
    Agendamento.find({ cliente: clienteId })
        .populate("veiculo")
        .populate("lavaRapido", "nome nomeFantasia endereco location contato")
        .sort({ data: -1 });

const findByIdService = (id) =>
    Agendamento.findById(id)
        .populate("cliente", "name email telefone")
        .populate("veiculo")
        .populate("lavaRapido", "nome nomeFantasia endereco location contato user");

const isOwner = (customer, userId) =>
    customer && customer.user && customer.user.toString() === String(userId);

const updateStatusService = async (id, status, userIdEd, options = {}) => {
    const { motivoFinalizacao = "", somenteDono = false } = options;
    const agendamento = await Agendamento.findById(id).populate("lavaRapido");

    if (!agendamento) {
        const err = new Error("Agendamento não encontrado");
        err.statusCode = 404;
        throw err;
    }

    const donoLavaRapido = isOwner(agendamento.lavaRapido, userIdEd);

    if (somenteDono && !donoLavaRapido) {
        const err = new Error("Apenas o dono do lava rápido pode finalizar este agendamento");
        err.statusCode = 403;
        throw err;
    }

    if (!donoLavaRapido && agendamento.cliente.toString() !== String(userIdEd)) {
        const err = new Error("Você não tem permissão para alterar este agendamento");
        err.statusCode = 403;
        throw err;
    }

    const statusValidos = ["agendado", "confirmado", "concluido", "cancelado"];
    if (!statusValidos.includes(status)) {
        const err = new Error("Status inválido");
        err.statusCode = 400;
        throw err;
    }

    const agora = new Date();
    agendamento.status = status;
    agendamento.alteradoPor = userIdEd;

    if (status === "concluido") {
        agendamento.finalizadoEm = agora;
        agendamento.canceladoEm = null;
        agendamento.motivoFinalizacao = "";
    } else if (status === "cancelado") {
        agendamento.canceladoEm = agora;
        agendamento.finalizadoEm = null;
        agendamento.motivoFinalizacao = String(motivoFinalizacao || "").trim();
    } else {
        agendamento.finalizadoEm = null;
        agendamento.canceladoEm = null;
        agendamento.motivoFinalizacao = "";
    }

    await agendamento.save();

    const STATUS_FILA = {
        agendado: "pendente",
        confirmado: "em atendimento",
        concluido: "finalizado",
        cancelado: "finalizado",
    };

    if (agendamento.veiculoFila && STATUS_FILA[status]) {
        const dadosFila = { status: STATUS_FILA[status] };
        if (STATUS_FILA[status] === "finalizado") {
            dadosFila.finishedAt = agora;
        }
        await Veiculo.findByIdAndUpdate(agendamento.veiculoFila, dadosFila, { new: true });
    }

    return agendamento;
};

const cancelService = (id, userIdEd, motivoFinalizacao) =>
    updateStatusService(id, "cancelado", userIdEd, { motivoFinalizacao });

const finalizarService = (id, userIdEd, motivoFinalizacao) =>
    updateStatusService(id, "cancelado", userIdEd, {
        motivoFinalizacao,
        somenteDono: true,
    });

export default {
    createService,
    findAllByLavaRapido,
    findAllByCliente,
    findByIdService,
    updateStatusService,
    cancelService,
    finalizarService,
};