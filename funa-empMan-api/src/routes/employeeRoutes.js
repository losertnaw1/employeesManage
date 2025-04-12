const express = require('express');
const multer = require('multer');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const Employee = require('../models/Employee');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cvs'); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên file tránh trùng
    }
});

const upload = multer({ storage });

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);

// Search endpoint - must be before /:id routes to avoid conflicts
router.get('/search', async (req, res) => {
    try {
        const { field, term } = req.query;

        if (!field || !term) {
            return res.status(400).json({ message: 'Field and term parameters are required' });
        }

        let query = {};

        // Handle different field types
        if (['skills', 'previousProjects'].includes(field)) {
            // For array fields, use $in operator
            query[field] = { $in: [new RegExp(term, 'i')] };
        } else {
            // For string fields, use regex for case-insensitive search
            query[field] = { $regex: term, $options: 'i' };
        }

        const employees = await Employee.find(query);
        res.json(employees);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching employees', error: error.message });
    }
});

router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.post('/:id/upload-cv', upload.single('cv'), async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Nhân sự không tồn tại' });

        // Đảm bảo đường dẫn đúng
        employee.cvUrl = `/uploads/cvs/${req.file.filename}`;
        await employee.save();

        res.json({
            message: 'Upload CV thành công',
            cvUrl: employee.cvUrl,
            employee
        });
    } catch (error) {
        console.error('Error uploading CV:', error);
        res.status(500).json({ message: 'Lỗi khi upload CV', error: error.message });
    }
});

// Endpoint để tải xuống CV
router.get('/:id/download-cv', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Nhân sự không tồn tại' });
        if (!employee.cvUrl) return res.status(404).json({ message: 'CV không tồn tại' });

        // Lấy đường dẫn file từ database
        const filePath = employee.cvUrl.replace('/uploads/', '');
        const fullPath = `${process.cwd()}/uploads/${filePath}`;

        // Gửi file về client
        res.download(fullPath, filePath.split('/').pop(), (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ message: 'Lỗi khi tải xuống file', error: err.message });
            }
        });
    } catch (error) {
        console.error('Error downloading CV:', error);
        res.status(500).json({ message: 'Lỗi khi tải xuống CV', error: error.message });
    }
});

// Endpoint để lấy thông tin CV
router.get('/:id/cv-info', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Nhân sự không tồn tại' });

        if (!employee.cvUrl) {
            return res.json({ hasCv: false });
        }

        const fileName = employee.cvUrl.split('/').pop();

        res.json({
            hasCv: true,
            fileName,
            cvUrl: employee.cvUrl
        });
    } catch (error) {
        console.error('Error getting CV info:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin CV', error: error.message });
    }
});

module.exports = router;
