const mongoose = require('mongoose');

// define schema for enquiry data
const customerEnquirySchema = new mongoose.Schema({
    
    // user details
    name: {
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
    linkedinUrl: {
        type: String,
        default: ""
    },
    city: {
        type : String,
        default : ""
    },
    country: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },

    // company details
    companyName: {
        type: String,
        default: ""
    },
    website_url: {
        type: String,
        default: ""
    },
    companyPhone: {
        type: String,
        default: ""
    },
    size: {
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

    // other details
    page_url: {
        type: String,
        default: ""
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
    seoActivity: {
        type: String,
        default: ""
    },

    // extra
    date: {
        type: String
    },
    status: {
        type: String,
        default: ""
    },
    leadSource: {
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
    companyPhone: {
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