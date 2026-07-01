const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());

const config = {
    server: "DBSRV2025",
    database: "DIASPARKdb",
    options: {
        trustServerCertificate: true,
        encrypt: false
    },
    authentication: {
        type: "default",
        options: {
            userName: "retail",
            password: "retail@1234"
        }
    }
};

sql.connect(config)
    .then(() => {
        console.log("SQL Connected to POSDB");
    })
    .catch(err => {
        console.log("Database connection failed:", err.message);
    });

app.get("/api/customers", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Customers");
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

app.get("/data", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM dbo.temp_May_all_05");
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server Running on port 5000");
});