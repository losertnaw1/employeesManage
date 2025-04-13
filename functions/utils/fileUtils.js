const fs = require('fs');
const path = require('path');

// Function to create upload directories
const createUploadDirectories = () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const cvsDir = path.join(uploadsDir, 'cvs');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  if (!fs.existsSync(cvsDir)) {
    fs.mkdirSync(cvsDir, { recursive: true });
    console.log('Created cvs directory');
  }
};

module.exports = {
  createUploadDirectories
};
