import User from "../models/User.js";
import bcrypt from "bcryptjs";

const createService = (body) => User.create(body);

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