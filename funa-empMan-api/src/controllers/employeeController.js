const Employee = require('../models/Employee');
const mongoose = require('mongoose');

exports.getAllEmployees = async (req, res) => {
    try {
        console.log('Fetching all employees...');
        console.log('MongoDB URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

        // Log the collection name
        console.log('Collection name:', Employee.collection.name);
        console.log('Database name:', Employee.db.name);

        // Count documents in collection
        const count = await Employee.countDocuments();
        console.log(`Document count: ${count}`);

        // Get all employees
        const employees = await Employee.find().lean();
        console.log(`Found ${employees.length} employees`);

        if (employees.length > 0) {
            console.log('First employee:', JSON.stringify(employees[0]));
        } else {
            console.log('No employees found');

            // Try to find documents directly using Mongoose connection
            const db = mongoose.connection.db;
            if (db) {
                const collection = db.collection('employees');
                const docs = await collection.find({}).toArray();
                console.log(`Direct query found ${docs.length} documents`);
                if (docs.length > 0) {
                    console.log('First document:', JSON.stringify(docs[0]));
                }
            }
        }

        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên', error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Lỗi khi tạo nhân viên mới', error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin nhân viên', error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật nhân viên', error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }
        res.json({ message: 'Xóa nhân viên thành công', employee: deletedEmployee });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Lỗi khi xóa nhân viên', error: error.message });
    }
};
