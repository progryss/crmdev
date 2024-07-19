const express = require('express');
const router =express.Router();
const allController = require('../controllers/auth-controller');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const targetPath = path.join(__dirname, '../../uploads'); 
        fs.mkdir(targetPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Failed to create directory', err);
                return cb(err);
            }
            cb(null, targetPath);
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.json');
    }
});
const upload = multer({ storage: storage });

// routes
router.get('/h', allController.home);
router.get('/get-enquiries', allController.getEnquiries);
router.get('/get-company_data', allController.getCompanyData);

router.post('/create-enquiry', allController.createEnquiry);
router.post('/create-company', allController.createCompany);
router.post('/upload-company_data',upload.single('jsonFile'),allController.uploadCompanyData)

router.put('/update-enquiry/:id', allController.updateEnquiry);
router.put('/update-company/:id', allController.updateCompany);

router.delete('/delete-enquiry/:id', allController.deleteEnquiry);
router.delete('/delete-company/:id', allController.deleteCompany);
router.delete('/delete-enquiries', allController.deleteMultipleEnquiry);
router.delete('/delete-companies', allController.deleteMultipleCompanies);


module.exports = router; 