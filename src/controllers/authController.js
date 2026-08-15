import bcrypt from "bcryptjs";
import { loginService, generateToken } from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    const user = await loginService(email);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(password, user.password);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login realizado com sucesso",
      user: publicUser(user),
    });

  } catch (err) {
    console.error("ERRO LOGIN:", err);
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    return res.status(200).json({ user: publicUser(req.user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logout realizado com sucesso" });
};