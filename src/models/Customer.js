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

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;