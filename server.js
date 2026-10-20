const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

// Admin login
app.post("/api/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;

        if (!adminUsername || !adminPassword || !jwtSecret) {
            console.error(
                "Admin authentication environment variables are missing."
            );

            return res.status(500).json({
                error: "Admin login is not configured"
            });
        }

        if (
            username.trim() !== adminUsername ||
            password !== adminPassword
        ) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                username: adminUsername,
                role: "admin"
            },
            jwtSecret,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Admin login successful",
            token,
            user: {
                username: adminUsername,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            error: "Unable to log in"
        });
    }
});

// ==========================================
// ADMIN ACCESS PROTECTION
// ==========================================

function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Admin authentication required"
        });
    }

    const token = authHeader.slice(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("JWT_SECRET is not configured.");

        return res.status(500).json({
            error: "Authentication is not configured"
        });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (
            decoded.role !== "admin" ||
            decoded.username !== process.env.ADMIN_USERNAME
        ) {
            return res.status(403).json({
                error: "Admin access denied"
            });
        }

        req.admin = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired login token"
        });
    }
}

// Verify admin token
app.get("/api/admin/verify", requireAdmin, (req, res) => {
    res.json({
        authenticated: true,
        user: {
            username: req.admin.username,
            role: req.admin.role
        }
    });
});

// ==========================================
// DATABASE CONNECTION TEST
// ==========================================

app.get("/api/test", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS databaseName"
        );

        return res.json({
            message: "Backend connected to MySQL successfully!",
            database: rows[0].databaseName
        });
    } catch (error) {
        console.error("Database test error:", error.message);

        return res.status(500).json({
            error: "Database connection failed"
        });
    }
});

// ==========================================
// EVENTS
// ==========================================

// Get all events (public)
app.get("/api/events", async (req, res) => {
    try {
        const [events] = await db.query(`
            SELECT
                e.event_id,
                e.title,
                e.description,
                e.venue,
                e.event_date,
                e.capacity,
                s.full_name AS organizer
            FROM Events e
            LEFT JOIN Students s
                ON e.created_by = s.student_id
            ORDER BY e.event_date ASC
        `);

        return res.json(events);
    } catch (error) {
        console.error("Fetch events error:", error.message);

        return res.status(500).json({
            error: "Unable to fetch events"
        });
    }
});

// Add a new event (admin only)
app.post("/api/events", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            description,
            venue,
            event_date,
            capacity,
            created_by
        } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof venue !== "string" ||
            !venue.trim() ||
            !event_date ||
            !Number.isInteger(Number(capacity)) ||
            Number(capacity) < 1 ||
            !Number.isInteger(Number(created_by)) ||
            Number(created_by) < 1
        ) {
            return res.status(400).json({
                error: "Please provide valid event details and student ID"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO Events
                (title, description, venue, event_date, capacity, created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                title.trim(),
                description || null,
                venue.trim(),
                event_date,
                Number(capacity),
                Number(created_by)
            ]
        );

        return res.status(201).json({
            message: "Event added successfully",
            event_id: result.insertId
        });
    } catch (error) {
        console.error("Add event error:", error.message);

        return res.status(500).json({
            error: "Unable to add event. Check the supplied student ID and event details."
        });
    }
});

// ==========================================
// STUDENT EVENT REGISTRATIONS
// ==========================================

// Register a student for an event (public for now)
app.post("/api/registrations", async (req, res) => {
    try {
        const { student_id, event_id } = req.body;

        if (
            !Number.isInteger(Number(student_id)) ||
            Number(student_id) < 1 ||
            !Number.isInteger(Number(event_id)) ||
            Number(event_id) < 1
        ) {
            return res.status(400).json({
                error: "Valid student_id and event_id are required"
            });
        }

        const studentId = Number(student_id);
        const eventId = Number(event_id);

        const [students] = await db.execute(
            "SELECT student_id FROM Students WHERE student_id = ?",
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        const [events] = await db.execute(
            "SELECT capacity FROM Events WHERE event_id = ?",
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        const [existing] = await db.execute(
            `SELECT registration_id
             FROM Registrations
             WHERE student_id = ?
               AND event_id = ?
               AND status = 'registered'`,
            [studentId, eventId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                error: "Student is already registered for this event"
            });
        }

        const [count] = await db.execute(
            `SELECT COUNT(*) AS total
             FROM Registrations
             WHERE event_id = ?
               AND status = 'registered'`,
            [eventId]
        );

        if (Number(count[0].total) >= Number(events[0].capacity)) {
            return res.status(409).json({
                error: "This event is full"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO Registrations
                (student_id, event_id, status)
             VALUES (?, ?, 'registered')`,
            [studentId, eventId]
        );

        return res.status(201).json({
            message: "Student registered successfully",
            registration_id: result.insertId
        });
    } catch (error) {
        console.error("Student registration error:", error.message);

        return res.status(500).json({
            error: "Unable to register student"
        });
    }
});

// View all registrations (admin only)
app.get("/api/registrations", requireAdmin, async (req, res) => {
    try {
        const [registrations] = await db.query(`
            SELECT
                r.registration_id,
                s.student_id,
                s.full_name,
                s.email,
                e.event_id,
                e.title AS event_title,
                r.registered_at,
                r.status
            FROM Registrations r
            JOIN Students s
                ON r.student_id = s.student_id
            JOIN Events e
                ON r.event_id = e.event_id
            ORDER BY r.registered_at DESC
        `);

        return res.json(registrations);
    } catch (error) {
        console.error("Fetch registrations error:", error.message);

        return res.status(500).json({
            error: "Unable to fetch registrations"
        });
    }
});

// ==========================================
// EVENT FEEDBACK
// ==========================================

// Submit feedback for an event
app.post("/api/feedback", async (req, res) => {
    try {
        const { student_id, event_id, rating, comments } = req.body;

        const studentId = Number(student_id);
        const eventId = Number(event_id);
        const ratingValue = Number(rating);

        if (
            !Number.isInteger(studentId) ||
            studentId < 1 ||
            !Number.isInteger(eventId) ||
            eventId < 1 ||
            !Number.isInteger(ratingValue) ||
            ratingValue < 1 ||
            ratingValue > 5
        ) {
            return res.status(400).json({
                error: "Provide valid student_id, event_id, and rating from 1 to 5"
            });
        }

        if (
            comments !== undefined &&
            comments !== null &&
            typeof comments !== "string"
        ) {
            return res.status(400).json({
                error: "Comments must be text"
            });
        }

        // Corrected SQL query: the SQL statement must be a string.
        const [result] = await db.execute(
            `INSERT INTO Feedback
                (student_id, event_id, rating, comments)
             VALUES (?, ?, ?, ?)`,
            [
                studentId,
                eventId,
                ratingValue,
                comments?.trim() || null
            ]
        );

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback_id: result.insertId
        });
    } catch (error) {
        console.error("Submit feedback error:", error.message);

        return res.status(500).json({
            error: "Unable to submit feedback"
        });
    }
});

// ==========================================
// STUDENT ROUTES
// ==========================================

app.use("/api", require("./routes/student"));

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
    try {
        // Verify the MySQL connection before starting the server.
        const connection = await db.getConnection();

        try {
            await connection.ping();
        } finally {
            connection.release();
        }

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            // Corrected template literal using backticks.
            console.log(`Server running at http://localhost:${port}`);
            console.log("MySQL connection successful");
        });
    } catch (error) {
        console.error(
            "Could not connect to MySQL:",
            error.message
        );

        process.exit(1);
    }
}

startServer();