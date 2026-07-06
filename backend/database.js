const sqlite3 = require("sqlite3").verbose();

// ================= DATABASE CONNECTION =================

const db = new sqlite3.Database("./prompts.db", (err) => {

    if (err) {

        console.log("Database Error:", err.message);

    } else {

        console.log("✅ Connected to SQLite Database");

    }

});

// ================= CREATE TABLES =================

db.serialize(() => {

    // Prompts Table

    db.run(`
        CREATE TABLE IF NOT EXISTS prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            text TEXT,
            category TEXT
        )
    `);
    // Add Type Column

    db.run("ALTER TABLE prompts ADD COLUMN type TEXT", (err) => {

        if (err && !err.message.includes("duplicate column")) {

            console.log(err.message);

        }

    });

    // Add Created Date Column

    db.run("ALTER TABLE prompts ADD COLUMN created_at TEXT", (err) => {

        if (err && !err.message.includes("duplicate column")) {

            console.log(err.message);

        }

    });

    // Admins Table

    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    // Default Admin

    db.run(`
    INSERT OR IGNORE INTO admins (username, password)
    VALUES ('admin@gmail.com', '12345')
`);

});

module.exports = db;