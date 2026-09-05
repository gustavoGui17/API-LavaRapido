import mongoose from "mongoose"

const veiculoSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
    },
    modelo: {
        type: String,
        required: true
    },
    cor: {
        type: String,
        required: true
    },
    tipoLavagem: {
        type: String,
        enum: ["simples", "completa", "premium"],
        required: true
    },
    nomeCliente: {
        type: String,
        required: true
    },
    contato: {
        type: String,
        required: true
    },
    entryDate: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["pendente", "em atendimento", "finalizado"],
        default: "pendente"
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: false,
        index: true
    }
})

const Veiculo =
    mongoose.models.Veiculo || mongoose.model("Veiculo", veiculoSchema);

export default Veiculo;