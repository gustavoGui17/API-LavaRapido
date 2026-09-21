import mongoose from "mongoose";

const agendamentoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    lavaRapido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
        index: true,
    },
    veiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VeiculoCliente",
        required: true,
    },
    veiculoFila: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veiculo",
        default: null,
    },
    data: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["agendado", "confirmado", "concluido", "cancelado"],
        default: "agendado",
    },
    observacao: {
        type: String,
        trim: true,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false,
    },
});

agendamentoSchema.index({ lavaRapido: 1, data: 1 });

const Agendamento =
    mongoose.models.Agendamento || mongoose.model("Agendamento", agendamentoSchema);

export default Agendamento;