import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import socket from "socket.io";
import { createServer } from "http";

import { mainRouter } from "./routes/v1";
import { port, origin } from "./config";
import { escapeBody } from "./middleware/escapeBody";

import "./lib/db";
import { socketListener } from "./socket";
import { socketAuthHandler } from "./socket/authHandler";

const app = Express();
const server = createServer(app);
const io = socket(server);

const corsMiddleware: any = cors({ credentials: true, origin });

// Middleware
app.use(helmet() as any);

// Socket
io.use(socketAuthHandler).on("connection", socketListener);

// CORS
app.options(corsMiddleware);
app.use(corsMiddleware);

app.use(cookieParser() as any);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(escapeBody);

// Routes
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.use("/", mainRouter);

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
