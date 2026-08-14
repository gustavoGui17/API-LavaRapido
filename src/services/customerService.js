import Customer from "../models/Customer.js";
import User from "../models/User.js";

const createService = async (body) => {
    const { name, email, password, nomeFantasia, documento, documentoTipo, contato, status } = body;

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

const updateService = (id, body) =>
    Customer.findByIdAndUpdate(id, body, { new: true });

const removeService = (id) => Customer.findByIdAndDelete(id);

export default {
    createService,
    findAllService,
    findByIdService,
    updateService,
    removeService
};