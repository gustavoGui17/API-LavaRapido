import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connetcDataBase from "./src/database/db.js";

import veiculoRoute from "./src/routes/veiculoRoute.js";
import userRoute from "./src/routes/userRoute.js";
import customerRoute from "./src/routes/customerRoute.js"
import authRoute from "./src/routes/authRoute.js";
import swaggerRoute from "./src/routes/swaggerRoute.cjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const isLocalDev = process.env.NODE_ENV !== "production";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedFromEnv = (process.env.FRONTEND_URL || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    if (allowedFromEnv.includes(origin)) return callback(null, true);

    if (isLocalDev && /^http:\/\/localhost(:\d{1,5})?$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

connetcDataBase()
app.use(express.json());

app.use("/user", userRoute);
app.use("/customers",customerRoute);
app.use("/auth", authRoute);
app.use("/veiculo", veiculoRoute);
app.use("/doc", swaggerRoute);


app.listen(port, () => console.log(`Servidor Rodando na Porta ${port}`));