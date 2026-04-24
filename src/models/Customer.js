import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    cnpj: {
        type: String,
        required: true,
        unique: true,
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