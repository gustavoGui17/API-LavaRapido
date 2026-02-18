import {
    createService,
    topVeiculoService,
    findByIdService,
    searchByPlacaService,
    updateService,
    byUserService,
} from "../services/veiculoService.js";

import Veiculo from "../models/Veiculo.js";

const create = async (req, res) => {
    try {
        const { placa, modelo, cor, tipoLavagem, nomeCliente, contato } = req.body;

        if (!placa || !modelo || !cor || !tipoLavagem || !nomeCliente || !contato) {
            return res.status(400).send({ message: "Por favor, preencha todos os campos" });
        }

        const veiculo = await createService({
            placa,
            modelo,
            cor,
            tipoLavagem,
            nomeCliente,
            contato,
            usuario: req.userId,
        });

        if (!veiculo) {
            return res.status(400).send({ message: "Erro na criação do veículo" });
        }

        res.status(201).send({
            message: "Veículo cadastrado com sucesso",
            veiculo
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        let { limit = 5, offset = 0, search = "" } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        const filtro =
            req.user.role === "admin"
                ? {}
                : { usuario: req.user.id };

        const veiculos = await Veiculo.find({
            ...filtro,
            $or: [
                { placa: { $regex: search, $options: "i" } },
                { modelo: { $regex: search, $options: "i" } },
                { nomeCliente: { $regex: search, $options: "i" } },
            ],
        })
            .skip(offset)
            .limit(limit);

        const total = await Veiculo.countDocuments({
            ...filtro,
            $or: [
                { placa: { $regex: search, $options: "i" } },
                { modelo: { $regex: search, $options: "i" } },
                { nomeCliente: { $regex: search, $options: "i" } },
            ],
        });

        return res.status(200).json({
            limit,
            offset,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(offset / limit) + 1,
            results: veiculos,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

const topVeiculo = async (req, res) => {
    try {
        const veiculo = await topVeiculoService()

        if (!veiculo) {
            return res.status(400).send({ message: "Não tem Veiculos cadastrados" });
        }

        res.send({
            veiculo: {
                id: veiculo._id,
                placa: veiculo.placa,
                modelo: veiculo.modelo,
                cor: veiculo.cor,
                tipoLavagem: veiculo.tipoLavagem,
                nomeCliente: veiculo.nomeCliente,
                contato: veiculo.contato
            }
        })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const findById = async (req, res) => {
    try {
        const id = req.params.id;

        const veiculo = await findByIdService(id);

        return res.send({
            veiculo: {
                id: veiculo._id,
                placa: veiculo.placa,
                modelo: veiculo.modelo,
                cor: veiculo.cor,
                tipoLavagem: veiculo.tipoLavagem,
                nomeCliente: veiculo.nomeCliente,
                contato: veiculo.contato
            }
        })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const searchByPlaca = async (req, res) => {
    try {
        const { placa } = req.query;

        const veiculo = await searchByPlacaService(placa);

        if (veiculo.length === 0) {
            return res.status(400).send({ message: "Nao existe essa placa no sistema" })
        }

        return res.send({
            results: veiculo.map(item => ({
                id: item._id,
                placa: item.placa,
                modelo: item.modelo,
                cor: item.cor,
                tipoLavagem: item.tipoLavagem,
                nomeCliente: item.nomeCliente,
                contato: item.contato
            }))
        })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const veiculo = await byUserService(id);

        return res.send({
            results: veiculo.map(item => ({
                id: item._id,
                placa: item.placa,
                modelo: item.modelo,
                cor: item.cor,
                tipoLavagem: item.tipoLavagem,
                nomeCliente: item.nomeCliente,
                contato: item.contato
            }))
        })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const update = async (req, res) => {
    try {
        const { placa, modelo, cor, tipoLavagem, nomeCliente, contato, status } = req.body;
        const { id } = req.params;

        if (!placa && !modelo && !cor && !tipoLavagem && !nomeCliente && !contato && !status) {
            return res.status(400).send({ message: "Selecione o campo para atualizar" });
        }

        const veiculo = await findByIdService(id);

        if (
            veiculo.usuario.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Sem permissão" });
        }

        await updateService(id, placa, modelo, tipoLavagem, cor, nomeCliente, contato, status);

        return res.send({ message: "Atualização com sucesso" })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const erase = async (req, res) => {
    try {

        const { id } = req.params;

        const veiculo = await findByIdService(id);

        if (
            veiculo.usuario.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Sem permissão" });
        }

        if (veiculo.status === "finalizado" && req.user.role !== "admin") {
            return res.status(403).json({
                message: "Apenas admin pode excluir veículo finalizado",
            });
        }

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export { create, findAll, topVeiculo, findById, searchByPlaca, byUser, update, erase }