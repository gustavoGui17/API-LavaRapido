import {
    createService,
    findAllService,
    countVeiculos,
    topVeiculoService,
    findByIdService,
    searchByPlacaService,
    updateService,
    byUserService,
    eraseService
} from "../services/veiculoService.js";

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
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5
        }

        if (!offset) {
            offset = 0
        }

        const veiculo = await findAllService(offset, limit);
        const total = await countVeiculos();
        const currentUrl = req.baseUrl

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (veiculo.length === 0) {
            return res.status(400).send({ message: "NãO tem Veiculos cadastrados" });
        }

        res.send({
            nextUrl,
            previous,
            limit,
            offset,
            total,

            results: veiculo.map(item => ({
                id: item._id,
                placa: item.placa,
                modelo: item.modelo,
                cor: item.cor,
                nomeCliente: item.nomeCliente,
                contato: item.contato
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
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

        if (veiculo.usuario._id.toString() != req.userId) {
            return res.status(400).send({
                message: "Voce não pode atualizar esse veiculo"
            })
        }

        await updateService(id, placa, modelo, tipoLavagem, cor, nomeCliente, contato, status);

        return res.send({ message: "Atualização com sucesso" })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const erase = async (req, res) => {
    try {

        const {id} = req.params;

        const veiculo = await findByIdService(id);

        if (veiculo.usuario._id.toString() != req.userId) {
            return res.status(400).send({
                message: "Voce não pode deletar esse veiculo"
            })
        }

        await eraseService(id);

        return res.send({ message: "Veiculo deletado com sucesso" })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export { create, findAll, topVeiculo, findById, searchByPlaca, byUser, update, erase }