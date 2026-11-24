import User from "../models/User.js";
import bcrypt from "bcryptjs";

const createService = (body) => User.create({
    name: body.name || body.nome,
    email: body.email,
    password: body.password,
    telefone: body.telefone || body.contato || "",
    endereco: body.endereco,
    location: normalizeLocation(body.location),
    role: "consumidor",
});

const normalizeLocation = (location) => {
    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        return undefined;
    }

    const [longitude, latitude] = location.coordinates;

    if (!Number.isFinite(Number(longitude)) || !Number.isFinite(Number(latitude))) {
        return undefined;
    }

    return {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
    };
};

const findAllService = async () => {
    return await User.find().populate("veiculos");
};

const findByIdService = (id) => User.findById(id);

const updateService = async (id, dados = {}) => {
    const updateData = {};

    if (dados.name !== undefined) updateData.name = dados.name;
    if (dados.email !== undefined) updateData.email = dados.email;
    if (dados.telefone !== undefined) updateData.telefone = dados.telefone;
    if (dados.endereco !== undefined) updateData.endereco = dados.endereco;

    if (dados.location !== undefined) {
        const location = normalizeLocation(dados.location);
        if (location) updateData.location = location;
    }

    if (dados.password) {
        updateData.password = await bcrypt.hash(dados.password, 10);
    }

    return User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const removeService = (id) => User.findByIdAndDelete(id);

export default {
    createService,
    findAllService,
    findByIdService,
    updateService,
    removeService
}