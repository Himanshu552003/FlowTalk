import express from "express"
import { getStreamToken } from "../controllers/chat.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const route= express.Router()

route.get("/token",protectRoute, getStreamToken)

export default route;