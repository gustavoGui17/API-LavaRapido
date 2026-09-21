import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    nomeFantasia: {
        type: String,
        required: true,
    },
    documento: {
        type: String,
        required: true,
        unique: true,
    },
    documentoTipo: {
        type: String,
        enum: ["cpf", "cnpj"],
        required: true,
    },
    contato: {
        type: String,
        required: true,
    },
    endereco: {
        cep: { type: String, trim: true },
        logradouro: { type: String, trim: true },
        numero: { type: String, trim: true },
        bairro: { type: String, trim: true },
        cidade: { type: String, trim: true },
        estado: { type: String, trim: true },
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        },
    },
    diasFuncionamento: {
        type: [Number],
        default: [0, 1, 2, 3, 4, 5, 6],
    },
    status: {
        type: String,
        enum: ["ativo", "inativo"],
        default: "ativo",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false,
    }
});

customerSchema.index({ location: "2dsphere" }, { sparse: true });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;