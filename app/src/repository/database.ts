
import mysql from "promise-mysql";
//import ParamsData from "./param-data";
//import mysql from "mysql2-promise";

//Interface para la informacion que se maneja en cada metodo
interface ParamsData {
    table: string,
    id?: string,
    data?: any,
    idvalue?: any
}

class database {

    cnn: any;

    async conectarBD() {

        this.cnn = await mysql.createPool({
            connectionLimit: 10,
            host: process.env.MYSQL_SERVER || "localhost", //"10.10.0.7",
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PW || "pass", //"4c3r04dm1n",
            database: process.env.MYSQL_DB || "bd"
        });
    }

    getC() {
        return this.cnn;
    }

    private desconectarDB() {
        this.cnn.end(() => {
            //console.log("error:");            
        });
    }

    async querySelect(sql: string, data?: any) {
        let result: any = null;
        if (!data) {
            result = await this.cnn.query(sql);
        } else {
            result = await this.cnn.query(sql, data);
        }
        return result;
    }

    async save(param: ParamsData) {
        const { table, data } = param;
        if (!table && !data) { return { error: "Incomplete Data!!!" } }
        try {
            const result = await this.cnn.query(`INSERT INTO ${table} SET ? `, data);
            return result;
        } catch (error) {
            return error;
        }
    }

    async update(param: ParamsData) {
        const { table, data, id } = param;
        if (!data) { return { error: "Incomplete Parameters!!!" } }
        try {
            const result = await this.cnn.query(`UPDATE ${table} SET ? WHERE ${id} = ? `, [data, data[id || ""]]);
            return result;
        } catch (error) {
            return error;
        }
    }

    async remove(param: ParamsData) {
        const { table, data, id } = param;
        if (!data && !id) { return { error: "Incomplete Parameters!!!" } }
        try {
            const result = await this.cnn.query(`DELETE FROM ${table} WHERE ${id} = ? `, data[id || ""]);
            return result;
        } catch (error) {
            return error;
        }
    }

    async findAll(param: ParamsData) {
        const { table, id, idvalue } = param;
        try {
            const result = await this.cnn.query(`SELECT * FROM ${table}`);
            return result;
        } catch (error) {
            return error;
        }
    }

    async findOne(param: ParamsData) {
        const { table, id, idvalue } = param;
        if (!idvalue && !id) { return { error: "Incomplete Parameters!!!" } }
        try {
            const result = await this.cnn.query(`SELECT * FROM ${table} WHERE ${id} = ? `, idvalue);
            return result;
        } catch (error) {
            return error;
        }
    }

}

const db = new database();

export default db;
