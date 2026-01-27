import dotenv from "dotenv";
import userService from "../services/userService.js";
import jwt from "jsonwebtoken";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({ message: "Token não fornecido" });
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2) {
      return res.status(401).send({ message: "Token mal formatado" });
    }

    const [schema, token] = parts;

    if (schema !== "Bearer") {
      return res.status(401).send({ message: "Token com esquema inválido" });
    }

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Token inválido" });
      }

      const user = await userService.findByIdService(decoded.id);

      if (!user || !user._id) {
        return res.status(401).send({ message: "Usuário não encontrado" });
      }

      req.userId = user._id.toString();

      return next();
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};