import { Strategy, ExtractJwt } from "passport-jwt";
import db from "../repository/database";

const strategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || "secret"
    },
    async (payload, done) => {
        try {
            const result = await db.querySelect("SELECT * FROM users WHERE email = ?", [payload.email]);
            if (result.length < 0) {
                return done(null, false)
            }
            return done(null, result)
        } catch (error) {
            console.log(error);
        }

    }
);

export default strategy;