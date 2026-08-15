import dotenv from "dotenv";
import userService from "../services/userService.js";
import jwt from "jsonwebtoken";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const cookieToken = req.cookies?.token;

    let token;

    if (cookieToken) {
      token = cookieToken;
    } else if (authorization) {
      const parts = authorization.split(" ");

      if (parts.length !== 2) {
        return res.status(401).send({ message: "Token mal formatado" });
      }

      const [schema, bearerToken] = parts;

      if (schema !== "Bearer") {
        return res.status(401).send({ message: "Token com esquema inválido" });
      }

      token = bearerToken;
    }

    if (!token) {
      return res.status(401).send({ message: "Token não fornecido" });
    }

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Token inválido" });
      }

      const user = await userService.findByIdService(decoded.id);

      if (!user || !user._id) {
        return res.status(401).send({ message: "Usuário não encontrado" });
      }

      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return next();
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};