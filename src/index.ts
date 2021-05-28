import "./lib/db";

import { origin, port } from "./config";

import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { escapeBody } from "./middleware/escapeBody";
import helmet from "helmet";
import { mainRouter } from "./routes/v1";
import morgan from "morgan";
import socket from "socket.io";
import { socketAuthHandler } from "./socket/authHandler";
import { socketListener } from "./socket";

const app = Express();
const server = createServer(app);
const io = socket(server);

const corsMiddleware: any = cors({
  credentials: true,
  origin: true,
});

// Middleware
app.use(helmet());
app.use(morgan("combined"));

// Socket
io.use(socketAuthHandler).on("connection", socketListener);

// CORS
app.options(corsMiddleware);
app.use(corsMiddleware);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(escapeBody);

// Routes
app.use("/app/api/v1/", mainRouter);

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
