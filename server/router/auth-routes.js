const express = require('express');
const router =express.Router();
const allController = require('../controllers/auth-controller');

// routes
router.get('/', allController.home);
router.post('/create-enquiry', allController.createEnquiry);
router.put('/update-enquiry/:id', allController.updateEnquiry);
router.get('/get-enquiries', allController.getEnquiries);


module.exports = router; 