//@ts-check
import express from "express";
import dotenv from "dotenv";

// Loads .env file with local config if it exists
dotenv.config();

const app = express();

import cors from"cors";
app.use(cors());

/**
 * Routes
 */
import searchRouter from "./routes/search.js";
app.use("/api/search", searchRouter);
import statusRouter from "./routes/status.js";
app.use("/api/status", statusRouter);

import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

/**
 * Start up
 */
const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
    console.log(`LMGTFYAD API listening on port: ${PORT}`);
});
