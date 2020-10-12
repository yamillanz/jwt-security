
import mysql from "promise-mysql";
//import mysql from "mysql2-promise";

class database {

    cnn: any;

    async conectarBD() {
     
        this.cnn = await mysql.createPool({
            connectionLimit: 1,
            host:  process.env.MYSQL_SERVER || "localhost", //"10.10.0.7",
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PW || ".4C3r04dm1n", //"4c3r04dm1n",
            database: process.env.MYSQL_DB || "bingolaisla"
        });
    }

    getC() {
        return this.cnn;
    }

    private desconectarDB() {
        //this.cnn.disposer;
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
        //await this.cnn;
        //this.cnn = null;
        //this.desconectarDB();
        return result;
    }

    async inuup() {
        // const 
    }


}

const db = new database();

export default db;
