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

const updateService = async (id, name, email, password) => {
    const updateData = { name, email };

    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    return User.findByIdAndUpdate(id, updateData, { new: true });
};

const removeService = (id) => User.findByIdAndDelete(id);

export default {
    createService,
    findAllService,
    findByIdService,
    updateService,
    removeService
}