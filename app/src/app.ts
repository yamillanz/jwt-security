import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport"
import passportMidd from "./middlewares/passport";
import authRoutes from "./routes/index.route";
import db from "./repository/database";


const app = express();
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(morgan("dev"));
//app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passport.use(passportMidd);

db.conectarBD();

//test
app.get("/", async (req, resp) => {
    db.save({ table: "users", data: "" });
    //resp.status(201).json(result), 

});

app.get("/api/test", async (req, resp) => {

    try {
        //const result = await db.update({ table: "users", data: req.body, id: "email" });
        //const result = await db.remove({ table: "users", data: req.body, id: "email" });
        //const result = await db.save({table:""});
        const result = await db.findAll({table:"users"});
        resp.status(201).json(result);
    } catch (error) {
        resp.status(401).json(error); 
    }

});

app.use(authRoutes)

app.listen(app.get("port"));
console.log("Server express on port:", app.get("port"));