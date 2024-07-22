const { CustomerEnquiry, CompanyDatabase } = require('../models/user-model');
require("dotenv").config();
const fs = require('fs').promises;
const path = require('path');

const home = (req, res) => {
    res.status(200).send('i am home')
}

const getEnquiries = async (req, res) => {
    try {
        const response = await CustomerEnquiry.find();
        res.status(201).send(response)
    } catch (error) {
        res.status(500).send('error in fetching enquires from server')
    }
}

const getCompanyData = async (req, res) => {
    try {
        const response = await CompanyDatabase.find();
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send('error in getting company data')
    }
}

async function createEnquiry(req, res) {
    try {
        const request = await req.body;
        const mappedEnquiry = {
            
            name: request.name,
            email: request.email,
            phone: request.phone,
            linkedinUrl: request.linkedinUrl,
            city: request.city,
            country: request.country,
            message: request.message,

            companyName: request.companyName,
            companyPhone: request.companyPhone,
            website_url: request.website_url,
            size: request.size,
            rating: request.rating,
            reviews: request.reviews,
            minimumProjects: request.minimumProjects,
            hourlyRate: request.hourlyRate,

            page_url: request.page_url,
            service: request.service,
            budget: request.budget,
            startFrom: request.startFrom,
            seoActivity: request.seoActivity,

            date: request.date,
            status: request.status,
            leadSource: request.leadSource,
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

async function createCompany(req, res) {
    try {
        const request = await req.body;
        console.log(request)
        const mappedEnquiry = {
            date: request.date,
            companyName: request.companyName,
            websiteUrl: request.websiteUrl,
            profileLink: request.profileLink,
            rating: request.rating,
            reviews: request.reviews,
            minimumProjects: request.minimumProjects,
            hourlyRate: request.hourlyRate,
            size: request.size,
            city: request.city,
            country: request.country,
            servicesProvided: request.servicesProvided,
            name: request.name,
            linkedinUrl: request.linkedinUrl,
            bio: request.bio,
            email: request.email,
            phone: request.phone,
            status: request.status,
            comments: request.comments.map(comment => ({
                comment_text: comment.comment_text,
                comment_date: comment.comment_date
            }))
        };
        const newEnquiry = new CompanyDatabase(mappedEnquiry);
        await newEnquiry.save();
        res.status(200).send('Company data have been saved.');
    } catch (error) {
        console.error('Error in getting form data ', error);
        res.status(500).send('Error in getting form data');
    }
}

const updateEnquiry = async (req, res) => {
    try {
        const enquiryId = req.params.id;
        const updateData = req.body;
        const updatedEnquiry = await CustomerEnquiry.findByIdAndUpdate(
            enquiryId,
            {
                $set: {
                    name: updateData.name,
                    email: updateData.email,
                    phone: updateData.phone,
                    linkedinUrl: updateData.linkedinUrl,
                    city: updateData.city,
                    country: updateData.country,
                    message: updateData.message,

                    companyName: updateData.companyName,
                    companyPhone:updateData.companyPhone,
                    website_url: updateData.website_url,
                    size: updateData.size,
                    rating: updateData.rating,
                    reviews: updateData.reviews,
                    minimumProjects: updateData.minimumProjects,
                    hourlyRate: updateData.hourlyRate,

                    page_url: updateData.page_url,
                    service: updateData.service,
                    budget: updateData.budget,
                    startFrom: updateData.startFrom,
                    seoActivity: updateData.seoActivity,

                    date: updateData.date,
                    status: updateData.status,
                    leadSource: updateData.leadSource,
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

        res.status(200).send('company data updated successfully');
    } catch (error) {
        console.error('Error company data:', error);
        res.status(500).send('Error updating company data');
    }
}

const updateCompany = async (req, res) => {
    try {
        const enquiryId = req.params.id;
        const updateData = req.body;
        const updatedEnquiry = await CompanyDatabase.findByIdAndUpdate(
            enquiryId,
            {
                $set: {
                    date: updateData.date,
                    companyName: updateData.companyName,
                    websiteUrl: updateData.websiteUrl,
                    profileLink: updateData.profileLink,
                    rating: updateData.rating,
                    reviews: updateData.reviews,
                    minimumProjects: updateData.minimumProjects,
                    hourlyRate: updateData.hourlyRate,
                    size: updateData.size,
                    city: updateData.city,
                    country: updateData.country,
                    servicesProvided: updateData.servicesProvided,
                    name: updateData.name,
                    linkedinUrl: updateData.linkedinUrl,
                    bio: updateData.bio,
                    email: updateData.email,
                    phone: updateData.phone,
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




const deleteEnquiry = async (req, res) => {
    try {
        const enquiryId = req.params.id;

        // Find and delete the enquiry by its ID
        const deletedEnquiry = await CustomerEnquiry.findByIdAndDelete(enquiryId)

        if (!deletedEnquiry) {
            return res.status(404).send('Enquiry not found');
        }

        res.status(200).send('Enquiry deleted successfully');
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).send('Error deleting enquiry');
    }
}

const deleteCompany = async (req, res) => {
    try {
        const enquiryId = req.params.id;

        // Find and delete the enquiry by its ID
        const deletedEnquiry = await CompanyDatabase.findByIdAndDelete(enquiryId)

        if (!deletedEnquiry) {
            return res.status(404).send('Company not found');
        }

        res.status(200).send('Company data deleted successfully');
    } catch (error) {
        console.error('Error deleting company data:', error);
        res.status(500).send('Error deleting company data');
    }
}

const deleteMultipleEnquiry = async (req, res) => {
    try {
        const enquiryIds = req.body.ids;
        // Validate the input
        if (!Array.isArray(enquiryIds) || enquiryIds.length === 0) {
            return res.status(400).send('Invalid or no IDs provided');
        }

        // Perform the deletion
        const result = await CustomerEnquiry.deleteMany({
            _id: { $in: enquiryIds }
        });

        if (result.deletedCount === 0) {
            return res.status(404).send('No enquiries found to delete');
        }

        return res.status(200).send(`${result.deletedCount} enquiries deleted successfully`);
    } catch (error) {
        console.error('Error deleting enquiries:', error);
        res.status(500).send('Error deleting enquiries');
    }
}

const deleteMultipleCompanies = async (req, res) => {
    try {
        const companiesID = req.body.ids;
        if (!Array.isArray(companiesID) || companiesID.length === 0) {
            return res.status(400).send('Invalid or no IDs provided');
        }
        const result = await CompanyDatabase.deleteMany({
            _id: { $in: companiesID }
        });
        if (result.deletedCount === 0) {
            return res.status(404).send('No enquiries found to delete');
        }
        return res.status(200).send(`${result.deletedCount} Company data deleted successfully`);
    } catch (error) {
        console.error('Error deleting company data:', error);
        res.status(500).send('Error deleting company data');
    }
}

const uploadCompanyData = async (req, res) => {
    if (!req.file) {
        return res.status(404).send('No file uploaded');
    }
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);

    try {
        // Asynchronously read file content
        const rawFileData = await fs.readFile(filePath, 'utf8');
        const companyData = JSON.parse(rawFileData);

        const date = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formatted = date.toLocaleDateString('en-US', options);

        // Transform data for database insertion
        const transformedData = companyData.map(item => ({
            date: formatted,
            companyName: item.name,
            websiteUrl: item.website,
            profileLink: item.profile_link,
            rating: item.rating,
            reviews: item.reviews,
            minimumProjects: item.minimum_project,
            hourlyRate: item.hourly_rate,
            size: item.size,
            city: item.city,
            country: item.country,
            servicesProvided: item.services_provided.filter(elem => elem.trim() !== "").join(', '),
            name: item.Founder ? item.Founder['LinkedIn Meta Title'] : '',
            linkedinUrl: item.Founder ? item.Founder['LinkedIn URL'] : '',
            bio: item.Founder ? item.Founder['LinkedIn Meta Description'] : '',
            email: '',
            phone: '',
            comments: [],
            status: 'Open'
        }));

        const dataToAdd = [];
        const duplicateCompany = []
        for (let element of transformedData){
            let response = await CompanyDatabase.findOne({ companyName: element.companyName});
            if(!response){
                dataToAdd.push(element)
            }else{
                duplicateCompany.push(element)
            }

        }
        if(dataToAdd.length > 0){
            // Insert data into MongoDB
            await CompanyDatabase.insertMany(dataToAdd);
            res.status(200).send(`File uploaded successfully.${duplicateCompany.length > 0 ? duplicateCompany.length + " record already exist" : "" }`);
        }else{
            res.status(200).send('No new file to upload')
        }
        

    } catch (error) {
        console.error('Error in uploading company data:', error);
        res.status(500).send('Error in processing file: ' + error.message);
    } finally {
        // Cleanup: delete the uploaded file after processing
        await fs.unlink(filePath);
    }
};




module.exports = {
    home,
    createEnquiry,
    getEnquiries,
    updateEnquiry,
    deleteEnquiry,
    deleteMultipleEnquiry,
    uploadCompanyData,
    getCompanyData,
    createCompany,
    updateCompany,
    deleteCompany,
    deleteMultipleCompanies
};



