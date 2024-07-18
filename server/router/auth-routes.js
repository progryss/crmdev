const express = require('express');
const router =express.Router();
const allController = require('../controllers/auth-controller');
const multer = require('multer');
const upload = multer({ dest : 'uploads/'})

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