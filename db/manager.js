const mysql = require('mysql');
const config = require('../config.json');

var con;

module.exports = {
    connect() {
        return new Promise((resolve, reject) => {
            con = mysql.createConnection({
                host: config.db.host,
                user: config.db.username,
                password: config.db.password,
                database: config.db.database
            });
            con.connect(function(err) {
                if (err) reject(err);
                console.log("[DB] Connection to Database successful");
                resolve(con);
            });
        });
    },
    disconnect() {
        return new Promise((resolve, reject) => {
            con.destroy((err) => {
                if(err) reject(err);
                console.log("[DB] Connection to Database destroyed");
                con = null;
                resolve(con);
            });
        });
    },
    createDatabaseProfile() {
        if(!this.isconnected) return;
        return new Promise((resolve, reject) => {
            con.query("CREATE TABLE IF NOT EXISTS discord_connector (name VARCHAR(255), uuid VARCHAR(255), disid VARCHAR(255), role VARCHAR(255), date VARCHAR(255))", function (err, result) {
                if (err) reject(err);
                console.log("[DB] Database created");
                resolve(result);
            });
        });
    },
    fetchPlayer(playername) {
        if(!this.isconnected) return;
        return new Promise((resolve, reject) => {
            con.query("SELECT * FROM discord_connector WHERE name=" + playername, function (err, result, fields) {
                if (err) reject(err);
                console.log("[DB] Database created");
                resolve(result);
            });
        });
    },
    createUserTemplate() {

    },
    deleteUserTemplate() {

    },
    isconnected() {
        return (con == undefined);
    }
}