import VeiculoCliente from "../models/VeiculoCliente.js";

const createService = async (userId, body) => {
    const veiculo = await VeiculoCliente.create({
        placa: body.placa,
        modelo: body.modelo,
        cor: body.cor,
        ano: body.ano,
        user: userId,
    });

    return veiculo;
};

const findAllService = (userId) =>
    VeiculoCliente.find({ user: userId }).sort({ createdAt: -1 });

const findByIdService = (id) => VeiculoCliente.findById(id);

const updateService = (id, body) =>
    VeiculoCliente.findByIdAndUpdate(id, body, { new: true });

const removeService = (id) => VeiculoCliente.findByIdAndDelete(id);

export default {
    createService,
    findAllService,
    findByIdService,
    updateService,
    removeService,
};