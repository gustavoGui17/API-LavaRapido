import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, insira um email válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "cliente", "consumidor"],
        default: "cliente"
    },
    telefone: {
        type: String,
        trim: true,
        default: ""
    },
    endereco: {
        cep: { type: String, trim: true },
        cidade: { type: String, trim: true },
        estado: { type: String, trim: true },
        bairro: { type: String, trim: true },
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: undefined,
        },
    },
    veiculos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veiculo"
    }],
    createdAt: {
        select: false,
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;