const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    fullNameVi: String,
    fullNameCn: String,
    phoneNumber: String,
    mainWorkLocation: String,
    chineseLevel: String,
    educationLevel: String,
    projectManager: String,
    rank: String,
    skills: [String],
    previousProjects: [String],
    referrer: String,
    cvUrl: String,
    notes: String,
    updatedAt: Date,
    createdAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema, 'employees');
