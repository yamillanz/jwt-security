import { register, logout, getJWT, test } from './../controllers/auth.controller';
import { Router } from "express";
import passport from "passport";
//import verifyPassport from "../controller"

const router = Router();
//rutas
//router.post("/api/getauth", getJWT);
//router.get("/api/verify", passport.authenticate("jwt", { session: false }), verifyToken);
router.post("/api/register", register);
router.post("/api/login", getJWT);
router.get("/api/logout", logout);
router.get("/api/test", passport.authenticate("jwt", { session: false }), test);

export default router; 