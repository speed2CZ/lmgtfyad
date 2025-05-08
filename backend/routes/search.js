//@ts-check

import express from "express";
const router = express.Router();

import {
    searchViaGoogleAPI
} from "../controllers/search.js";

router.get("/", searchViaGoogleAPI);

export default router;
