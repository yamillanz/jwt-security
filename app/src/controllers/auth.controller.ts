import { User } from './../models/user';
import { Request, Response } from "express";
import db from "../repository/database";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

function createJWT(user: User) {
    // let usuario =  user.id
    return jwt.sign(user, process.env.JWT_SECRET || "secret", {
        expiresIn: 3600 * 24
    });
}

export const getJWT = async (req: Request, resp: Response) => {
    try {
        const usuario: User = req.body
        if (!usuario.email && !usuario.pass) {
            return resp.status(402).json({ msg: "Must send a user" });
        }

        const usuarioBD: User[] = await db.querySelect("SELECT * FROM users WHERE email = ?", [usuario.email]);
        //console.log("usuario bd: ", usuarioBD[0]);

        if (usuarioBD.length <= 0) {
            return resp.status(402).json({ msg: "User dont exist" });
        }

        const ismatch = await bcrypt.compare(usuario.pass, usuarioBD[0].pass);
        if (!ismatch) {
            return resp.status(402).json({ msg: "Worng data" });
        }

        return resp.status(201).json({ token: createJWT(usuario) });

    } catch (error) {
        resp.status(401).json({ err: error });
    }
}

export const register = async (req: Request, resp: Response) => {
    let usuario: User = req.body
    if (!usuario.email && !usuario.pass) {
        return resp.status(402).json({ msg: "Must send a user" });
    }

    //aplicando encriptacion al password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(usuario.pass, salt);
    usuario.pass = hash;

    try {

        let consulta = "INSERT INTO users SET ?"
        const result = await db.querySelect(consulta, [usuario]);
        const user: User[] = await db.querySelect("SELECT * FROM users WHERE email = ?", [usuario.email]);
        let { email } = user[0];
        resp.status(200).json({ "msg": "User Creted!", email});

    } catch (error) {
        resp.status(401).json({ err: error });
    }

}

export const logout = async (req: Request, resp: Response) => {

}

export const test = async (req: Request, resp: Response) => {
    resp.status(201).json({ "Mensagge": "Autorizado!!!" });
}
