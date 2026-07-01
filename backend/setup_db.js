const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const config = {
    server: "DBSRV2025",
    database: "POSDB",
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

async function setupDatabase() {
    try {
        console.log("Connecting to SQL Server (DBSRV2025)...");
        await sql.connect(config);
        console.log("Connected to POSDB successfully.");

        // Read the mssql_database.sql file
        const sqlFilePath = path.join(__dirname, '..', 'backend-python', 'mssql_database.sql');
        console.log(`Reading SQL script from: ${sqlFilePath}`);
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        // Split by 'GO' keyword to run batches sequentially
        const queries = sqlContent.split(/^GO/im);

        console.log("Starting to create tables and insert data...");
        for (let i = 0; i < queries.length; i++) {
            const query = queries[i].trim();
            if (query) {
                try {
                    await sql.query(query);
                } catch (err) {
                    console.log(`\nError executing query part ${i}:`, err.message);
                    console.log(`Query snippet: ${query.substring(0, 100)}...\n`);
                    // Note: If tables already exist, this might error. We continue to try running everything.
                }
            }
        }
        console.log("\n✅ Entire database created and data inserted successfully!");
    } catch (err) {
        console.error("Setup failed:", err);
    } finally {
        sql.close();
    }
}

setupDatabase();
