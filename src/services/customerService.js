import Customer from "../models/Customer.js";

const createService = (body) => Customer.create(body);

const findAllService = async (limit, offset, search) => {
    const query = search
        ? {
            $or: [
                { nome: { $regex: search, $options: "i" } },
                { cnpj: { $regex: search, $options: "i" } }
            ]
        }
        : {};

    const customers = await Customer.find(query)
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