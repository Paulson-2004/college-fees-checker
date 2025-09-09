// server.js

const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration using environment variables
const dbConfig = {
    user: process.env.DB_USER, // e.g., 'MZCET'
    password: process.env.DB_PASSWORD, // e.g., 'MZCET@1234'
    server: process.env.DB_SERVER, // e.g., '103.207.1.91'
    database: process.env.DB_DATABASE, // e.g., 'CSE8739'
    port: parseInt(process.env.DB_PORT, 10), // e.g., 1433
    options: {
        trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === 'true' // true or false
    }
};

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to the SQL Server database.');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the application if the connection fails
    }
};

// Call the function to connect to the database
connectToDatabase();

// API Routes

/**
 * @route POST /login
 * @desc Authenticate user
 * @access Public
 */
app.post('/login', async (req, res) => {
    const { sprNo, dob } = req.body;

    if (!sprNo || !dob) {
        return res.status(400).json({ success: false, message: 'SPR NO and DOB are required.' });
    }

    try {
        const request = new sql.Request();
        request.input('sprNo', sql.VarChar, sprNo);
        request.input('dob', sql.Date, dob);
        
        const result = await request.query(`
            SELECT * FROM Students 
            WHERE sprNo = @sprNo AND dob = @dob
        `);

        if (result.recordset.length > 0) {
            // Authentication successful
            const student = result.recordset[0];
            res.json({ success: true, data: student });
        } else {
            // Authentication failed
            res.status(401).json({ success: false, message: 'Invalid SPR NO or DOB.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

/**
 * @route GET /fee/:sprNo
 * @desc Get fee details for a student
 * @access Public (In production, consider authentication)
 */
app.get('/fee/:sprNo', async (req, res) => {
    const { sprNo } = req.params;

    try {
        const feeRequest = new sql.Request();
        feeRequest.input('sprNo', sql.VarChar, sprNo);
        const feeResult = await feeRequest.query(`
            SELECT * FROM Fees WHERE sprNo = @sprNo
        `);

        const studentRequest = new sql.Request();
        studentRequest.input('sprNo', sql.VarChar, sprNo);
        const studentResult = await studentRequest.query(`
            SELECT * FROM Students WHERE sprNo = @sprNo
        `);

        if (feeResult.recordset.length > 0 && studentResult.recordset.length > 0) {
            const feeDetails = feeResult.recordset[0];
            const student = studentResult.recordset[0];

            res.json({
                success: true,
                data: {
                    sprNo: student.sprNo,
                    dob: student.dob,
                    course: student.course,
                    year: student.year,
                    feeDetails
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Fee details not found.' });
        }
    } catch (error) {
        console.error('Error fetching fee details:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching fee details.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
