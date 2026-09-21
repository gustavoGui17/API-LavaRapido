import veiculoClienteService from "../services/veiculoClienteService.js";

const publicVeiculo = (v) => ({
    id: v._id,
    placa: v.placa,
    modelo: v.modelo,
    cor: v.cor,
    ano: v.ano,
});

const create = async (req, res) => {
    try {
        const { placa, modelo, cor, ano } = req.body;

        if (!placa || !modelo || !cor) {
            return res.status(400).send({ message: "Informe placa, modelo e cor do veículo" });
        }

        const veiculo = await veiculoClienteService.createService(req.user.id, req.body);

        return res.status(201).send({
            message: "Veículo cadastrado com sucesso",
            veiculo: publicVeiculo(veiculo),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).send({ message: "Esta placa já está cadastrada para você" });
        }
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        const veiculos = await veiculoClienteService.findAllService(req.user.id);

        return res.status(200).send({
            results: veiculos.map(publicVeiculo),
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const findById = async (req, res) => {
    try {
        const veiculo = await veiculoClienteService.findByIdService(req.params.id);

        if (!veiculo || veiculo.user.toString() !== req.user.id) {
            return res.status(404).send({ message: "Veículo não encontrado" });
        }

        return res.status(200).send({ veiculo: publicVeiculo(veiculo) });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const veiculo = await veiculoClienteService.findByIdService(id);

        if (!veiculo || veiculo.user.toString() !== req.user.id) {
            return res.status(404).send({ message: "Veículo não encontrado" });
        }

        const updated = await veiculoClienteService.updateService(id, req.body);

        return res.status(200).send({
            message: "Veículo atualizado com sucesso",
            veiculo: publicVeiculo(updated),
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const veiculo = await veiculoClienteService.findByIdService(id);

        if (!veiculo || veiculo.user.toString() !== req.user.id) {
            return res.status(404).send({ message: "Veículo não encontrado" });
        }

        await veiculoClienteService.removeService(id);

        return res.status(200).send({ message: "Veículo removido com sucesso" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

export default { create, findAll, findById, update, remove };