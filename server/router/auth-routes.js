const express = require('express');
const router =express.Router();
const allController = require('../controllers/auth-controller');

// routes
router.get('/h', allController.home);
router.get('/get-enquiries', allController.getEnquiries);
router.post('/create-enquiry', allController.createEnquiry);
router.put('/update-enquiry/:id', allController.updateEnquiry);
router.delete('/delete-enquiry/:id', allController.deleteEnquiry);


module.exports = router; 