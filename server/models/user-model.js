const mongoose = require('mongoose');

// define schema for enquiry data
const customerEnquirySchema = new mongoose.Schema({
    date: {
        type: String,
        // default: Date.now,  // Automatically set to current date
        // required: true
    },
    name: {
        type: String,
        required: true,
        trim: true       // Remove whitespace from both ends
    },
    email: {
        type: String,
        // required: true,
        // trim: true,
        // match: [/\S+@\S+\.\S+/, 'is invalid'],  // Email validation regex
        // lowercase: true
    },
    country: {
        type: String,
        required: true,  // Country is required
        trim: true
    },
    phone: {
        type: String,
        // required: true,
        // match: [/^\d{10,15}$/, 'is invalid'],  // Phone number should be 10-15 digits
        trim: true
    },
    message: {
        type: String,
        // required: true,
        trim: true,
        minlength: [0, 'Too short'],  // Minimum length for the message
        maxlength: [100000, 'Too long']  // Maximum length for the message 
    },
    page_url: {
        type: String,
        // required: true,
        // trim: true,
        // match: [/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/, 'is invalid']  
    },
    status: {
        type: String
    },
    service: {
        type: String,
        default: ""
    },
    budget: {
        type: String,
        default: ""
    },
    startFrom: {
        type: String,
        default: ""
    },
    website_url: {
        type: String,
        default: ""
    },
    seoActivity: {
        type: String,
        default: ""
    },
    comments: [{
        comment_text: { type: String },
        comment_date: { type: String }
    }]
});

const companyDatabaseSchema = new mongoose.Schema({
    date: {
        type: String
    },
    companyName: {
        type: String,
        default: ""
    },
    websiteUrl: {
        type: String,
        default: ""
    },
    profileLink: {
        type: String,
        default: ""
    },
    rating: {
        type: String,
        default: ""
    },
    reviews: {
        type: String,
        default: ""
    },
    minimumProjects: {
        type: String,
        default: ""
    },
    hourlyRate: {
        type: String,
        default: ""
    },
    size: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    servicesProvided: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    linkedinUrl: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    status: {
        type: String
    },
    comments: [{
        comment_text: {
            type: String,
            default: ""
        },
        comment_date: {
            type: String,
            default: ""
        }
    }]
})

const CustomerEnquiry = mongoose.model('Enquiry', customerEnquirySchema);
const CompanyDatabase = mongoose.model('Company', companyDatabaseSchema)

module.exports = { CustomerEnquiry, CompanyDatabase };