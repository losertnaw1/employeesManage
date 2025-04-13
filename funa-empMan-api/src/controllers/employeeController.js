const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        console.log('Fetching all employees...');
        const employees = await Employee.find();
        console.log(`Found ${employees.length} employees`);
        console.log('Employees:', JSON.stringify(employees));
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
