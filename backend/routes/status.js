//@ts-check

import express from "express";
const router = express.Router();

import {
    getStatus
} from "../controllers/status.js";

router.get("/", getStatus);

export default router;
