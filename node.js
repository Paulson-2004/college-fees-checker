const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentFeeChecker', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a Student Schema
const studentSchema = new mongoose.Schema({
    sprNo: String,
    dob: String,
    course: String,
    year: String,
    feeDetails: {
        hostelFee: String,
        tuitionFee: String,
        textbookFee: String,
        skillDevFee: String,
        examStationeryFee: String,
        notebookFee: String
    }
});

// Create a Student Model
const Student = mongoose.model('Student', studentSchema);

// Example route to get students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
});
