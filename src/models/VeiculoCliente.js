import mongoose from "mongoose";

const veiculoClienteSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    modelo: {
        type: String,
        required: true,
        trim: true,
    },
    cor: {
        type: String,
        required: true,
        trim: true,
    },
    ano: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

veiculoClienteSchema.index({ user: 1, placa: 1 }, { unique: true });

const VeiculoCliente =
    mongoose.models.VeiculoCliente ||
    mongoose.model("VeiculoCliente", veiculoClienteSchema);

export default VeiculoCliente;