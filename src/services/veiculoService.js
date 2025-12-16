import User from "../models/User.js"
import Veiculo from "../models/Veiculo.js";

export const createService = async (veiculoData) => {
  const veiculo = new Veiculo(veiculoData);
  await veiculo.save();

  const user = await User.findById(veiculo.usuario);

  if (!user) {
    throw new Error("Usuário não encontrado!");
  }

  await User.findByIdAndUpdate(
    veiculo.usuario,
    { $push: { veiculos: veiculo._id } },
    { new: true }
  );

  return veiculo;
};

export const findAllService = (offset, limit) => Veiculo.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("usuario");

export const countVeiculos = () => Veiculo.countDocuments();

export const topVeiculoService = () => Veiculo.findOne()

export const findByIdService = (id) => Veiculo.findById(id).populate("usuario");

export const searchByPlacaService = (placa) => Veiculo.find({placa: { $regex: placa || "", $options: "i" },}).sort({ _id: -1 }).populate("usuario");

export const byUserService = (id) => Veiculo.find({ usuario: id }).sort({ _id: -1 }).populate("usuario");

export const updateService = (id, placa, modelo, cor, tipoLavagem, nomeCliente, contato, status) =>
  Veiculo.findOneAndUpdate({ _id: id },
    { placa, modelo, cor, tipoLavagem, nomeCliente, contato, status },
    {
      rawRessult: true,
    }
  );

export const eraseService = (id) => Veiculo.findByIdAndDelete({ _id: id });