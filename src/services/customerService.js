import Customer from "../models/Customer.js";
import User from "../models/User.js";
import { calculateDistance } from "../utils/geo.js";

const normalizeLocation = (location) => {
    if (
        !location ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2
    ) {
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

const createService = async (body) => {
    const { name, email, password, nomeFantasia, documento, documentoTipo, contato, status, endereco, location } = body;

    const user = await User.create({
        name,
        email,
        password,
        role: "cliente",
    });

    const customer = await Customer.create({
        nome: name,
        nomeFantasia,
        documento,
        documentoTipo,
        contato,
        status,
        endereco,
        location: normalizeLocation(location),
        user: user._id,
    });

    return customer;
};

const findAllService = async (limit, offset, search) => {
    const query = search
        ? {
            $or: [
                { nome: { $regex: search, $options: "i" } },
                { documento: { $regex: search, $options: "i" } }
            ]
        }
        : {};

    const customers = await Customer.find(query)
        .populate("user", "name email")
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    return {
        results: customers,
        total
    };
};

const findByIdService = (id) => Customer.findById(id);

const findNearbyService = async ({ latitude, longitude, maxDistance, limit, search, status }) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        const err = new Error("Informe latitude e longitude válidas");
        err.statusCode = 400;
        throw err;
    }

    const maxDistancia =
        maxDistance && Number.isFinite(Number(maxDistance))
            ? Number(maxDistance)
            : 10000;

    const query = {
        status: status || "ativo",
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                $maxDistance: maxDistancia,
            },
        },
    };

    if (search) {
        query.$or = [
            { nome: { $regex: search, $options: "i" } },
            { nomeFantasia: { $regex: search, $options: "i" } },
            { "endereco.cidade": { $regex: search, $options: "i" } },
        ];
    }

    const lavaRapidos = await Customer.find(query)
        .limit(Number(limit) || 20)
        .select("-user -documento -documentoTipo -createdAt")
        .lean();

    return lavaRapidos.map((c) => {
        const { location, ...lavaRapido } = c;
        const distance =
            location && location.coordinates && location.coordinates.length === 2
                ? calculateDistance(lat, lng, location.coordinates[1], location.coordinates[0])
                : null;

        return { ...lavaRapido, distance };
    });
};

const updateService = (id, body) => {
    const { location, ...rest } = body;

    const dados = { ...rest };

    if (location !== undefined) {
        dados.location = normalizeLocation(location);
    }

    return Customer.findByIdAndUpdate(id, dados, { new: true });
};

const removeService = (id) => Customer.findByIdAndDelete(id);

export default {
    createService,
    findAllService,
    findByIdService,
    findNearbyService,
    updateService,
    removeService
};