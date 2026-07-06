const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "isLoggedIn"]
}));
app.use(express.json());
// ================= AUTH MIDDLEWARE =================

function checkLogin(req, res, next) {

    const isLoggedIn = req.headers["isLoggedIn"];

    if (isLoggedIn === "true") {
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized! Please Login First."
        });
    }

}

// Home Route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Get All Prompts
app.get("/prompts", (req, res) => {

    db.all("SELECT * FROM prompts", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);

    });

});

// Add Prompt
app.post("/prompts",checkLogin, (req, res) => {

    const { title, text, category, type } = req.body;

const created_at = new Date().toLocaleDateString("en-GB");

    db.run(
        "INSERT INTO prompts (title, text, category, type, created_at) VALUES (?, ?, ?, ?, ?)",
        [title, text, category, type, created_at],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Prompt Added Successfully",
                id: this.lastID
            });

        }
    );

});

// Edit Prompt
app.put("/prompts/:id",checkLogin, (req, res) => {

    const id = req.params.id;
    const { title, text, category, type } = req.body;

    db.run(
        "UPDATE prompts SET title = ?, text = ?, category = ?, type = ? WHERE id = ?",
        [title, text, category, type, id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Prompt Updated Successfully"
            });

        }
    );

});

// Delete Prompt
app.delete("/prompts/:id",checkLogin, (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM prompts WHERE id = ?",
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Prompt Deleted Successfully"
            });

        }
    );

});
// ================= LOGIN API =================

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM admins WHERE username = ? AND password = ?",
        [email, password],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (row) {

                res.json({
                    success: true,
                    message: "Login Successful"
                });

            } else {

                res.json({
                    success: false,
                    message: "Invalid Email or Password"
                });

            }

        }
    );

});
// Start Server
app.listen(5000, () => {

    console.log("Server started on port 5000");

});