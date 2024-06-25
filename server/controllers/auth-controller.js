const { CustomerEnquiry } = require('../models/user-model');
require("dotenv").config();

const home = (req, res) => {
    res.status(200).send('i am home')
}

async function createEnquiry(req, res) {
    try {
        const request = await req.body;
        console.log(request)
        const mappedEnquiry = {
            date: request.date,
            name: request.name,
            email: request.email,
            country: request.country,
            phone: request.phone,
            message: request.message,
            page_url: request.page_url,
            status: 'Pending', // Default status, adjust if necessary
            comments: request.comments.map(comment => ({
                comment_text: comment.comment_text,
                comment_date: comment.comment_date
            }))
        };
        const newEnquiry = new CustomerEnquiry(mappedEnquiry);
        await newEnquiry.save();
        res.status(200).send('Customer enquiries have been saved.');
    } catch (error) {
        console.error('Error in getting form data ', error);
        res.status(500).send('Error in getting form data');
    }
}

const updateEnquiry = async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the request parameters
        const updateData = req.body; // Get the update data from the request body

        // Find the enquiry by ID and update it with new data
        const updatedEnquiry = await CustomerEnquiry.findByIdAndUpdate(
            enquiryId,
            {
                $set: {
                    date: updateData.date,
                    name: updateData.name,
                    email: updateData.email,
                    country: updateData.country,
                    phone: updateData.phone,
                    message: updateData.message,
                    page_url: updateData.page_url,
                    status: updateData.status,
                    comments: updateData.comments.map(comment => ({
                        comment_text: comment.comment_text,
                        comment_date: comment.comment_date
                    }))
                }
            },
            { new: true, runValidators: true } // Options to return the updated document and run validation
        );

        if (!updatedEnquiry) {
            return res.status(404).send('Enquiry not found');
        }

        res.status(200).send('Enquiry updated successfully');
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).send('Error updating enquiry');
    }
}


const getEnquiries = async (req, res) => {
    try {
        const response = await CustomerEnquiry.find();
        res.status(201).send(response)
    } catch (error) {
        res.status(500).send('error in fetching enquires from server')
    }
}

module.exports = { home, createEnquiry, getEnquiries, updateEnquiry };



