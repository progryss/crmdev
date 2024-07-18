import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import { useNotification } from "./NotificationContext"; // Adjust the path if necessary

export default function AddCompany() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';

    const [commentsList, setCommentsList] = useState([]);
    const [comment, setComment] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingComment, setEditingComment] = useState("");

    const [company, setCompany] = useState({
        companyName: "",
        websiteUrl: "",
        profileLink: "",
        rating: "",
        reviews: "",
        minimumProjects: "",
        hourlyRate: "",
        size: "",
        city: "",
        country: "",
        servicesProvided: "",
        name: "",
        linkedinUrl: "",
        bio: "",
        email: "",
        phone: "",
    })

    const { showNotification } = useNotification();

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (comment.trim() !== "") {
            const newComment = {
                text: comment,
                timestamp: new Date().toLocaleString(),
            };
            setCommentsList([...commentsList, newComment]);
            setComment("");
        }
    };

    const handleCommentEdit = (index) => {
        setEditingIndex(index);
        setEditingComment(commentsList[index].text);
    };

    const handleEditCommentChange = (event) => {
        setEditingComment(event.target.value);
    };

    const handleEditSubmit = (index) => {
        if (editingComment.trim() !== "") {
            const updatedComments = [...commentsList];
            updatedComments[index].text = editingComment;
            setCommentsList(updatedComments);
            setEditingIndex(null);
            setEditingComment("");
        }
    };

    const handleCommentDelete = (index) => {
        const updatedComments = [...commentsList];
        updatedComments.splice(index, 1);
        setCommentsList(updatedComments);
    };

    const backToHome = () => {
        navigate('/database');
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const date = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formatted = date.toLocaleDateString('en-US', options);
        // Define the company data
        const companyData = {
            date: formatted, // Use current date-time
            companyName: company.companyName,
            websiteUrl: company.websiteUrl,
            profileLink: company.profileLink,
            rating: company.rating,
            reviews: company.reviews,
            minimumProjects: company.minimumProjects,
            hourlyRate: company.hourlyRate,
            size: company.size,
            city: company.city,
            country: company.country,
            servicesProvided: company.servicesProvided,
            name: company.name,
            linkedinUrl: company.linkedinUrl,
            bio: company.bio,
            email: company.email,
            phone: company.phone,
            comments: commentsList.map(comment => ({
                comment_text: comment.text,
                comment_date: comment.timestamp
            })),
            status: 'Open'
        };

        try {
            // Make the POST request to create an enquiry
            const response = await axios.post(`${baseURL}/api/create-company`, companyData);
            console.log(response.data);

            setCompany({
                companyName: "",
                websiteUrl: "",
                profileLink: "",
                rating: "",
                reviews: "",
                minimumProjects: "",
                hourlyRate: "",
                size: "",
                city: "",
                country: "",
                servicesProvided: "",
                name: "",
                linkedinUrl: "",
                bio: "",
                email: "",
                phone: "",
            })
            setCommentsList([]);

            navigate('/database');
        } catch (error) {
            console.error('Error in sending company data:', error);
        }

        // Simulate success notification
        showNotification('Company added successfully!', 'success', 'green', 'white');
    };

    return (
        <div className="container-fluid add-customer-container">
            <div className="card card-block border-0 add-customer-form">
                <div className="card-body p-0">
                    <div className="bg-light add-cutomer-section px-3 py-4">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <span><i className="fa fa-arrow-left" onClick={backToHome}></i></span>
                                        <span><i className="fas fa-user fa-sm"></i></span>
                                        <span>
                                            <h5 className="mb-0"><strong>Add Company</strong></h5>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div className="customer-details-grid">
                            <div className="card m-4 me-0">
                                <div className="card-body">
                                    <div className="form-grid-main">
                                        <div className="form-grid">
                                            <div className="form-grid-column-one">
                                                <div className="mb-4">
                                                    <label htmlFor="companyName" className="form-label label-value">Company Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="companyName"
                                                        value={company.companyName}
                                                        onChange={(event) => setCompany({ ...company, companyName: event.target.value })}
                                                        placeholder="Company name"
                                                    />
                                                </div>
                                               
                                                <div className="mb-4">
                                                    <label htmlFor="rating" className="form-label label-value">Rating</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="rating"
                                                        value={company.rating}
                                                        onChange={(event) => setCompany({ ...company, rating: event.target.value })}
                                                        placeholder="Add rating"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="reviews" className="form-label label-value">Reviews</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="reviews"
                                                        value={company.reviews}
                                                        onChange={(event) => setCompany({ ...company, reviews: event.target.value })}
                                                        placeholder="Add reviews"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="minimumProjects" className="form-label label-value">Minimum Projects</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="minimumProjects"
                                                        value={company.minimumProjects}
                                                        onChange={(event) => setCompany({ ...company, minimumProjects: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="hourlyRate" className="form-label label-value">Hourly Rate</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="hourlyRate"
                                                        value={company.hourlyRate}
                                                        onChange={(event) => setCompany({ ...company, hourlyRate: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="size" className="form-label label-value">Size</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="size"
                                                        value={company.size}
                                                        onChange={(event) => setCompany({ ...company, size: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="city" className="form-label label-value">City</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="city"
                                                        value={company.city}
                                                        onChange={(event) => setCompany({ ...company, city: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="country" className="form-label label-value">Country</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="country"
                                                        value={company.country}
                                                        onChange={(event) => setCompany({ ...company, country: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="servicesProvided" className="form-label label-value">Services Provided</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="servicesProvided"
                                                        value={company.servicesProvided}
                                                        onChange={(event) => setCompany({ ...company, servicesProvided: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>

                                            </div>
                                            <div className="form-grid-column-two">
                                                <div className="mb-4">
                                                    <label htmlFor="name" className="form-label label-value">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        value={company.name}
                                                        onChange={(event) => setCompany({ ...company, name: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="email" className="form-label label-value">Email</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="email"
                                                        value={company.email}
                                                        onChange={(event) => setCompany({ ...company, email: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="phone" className="form-label label-value">Phone</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="phone"
                                                        value={company.phone}
                                                        onChange={(event) => setCompany({ ...company, phone: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="linkedinUrl" className="form-label label-value">Linkedin Url</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="linkedinUrl"
                                                        value={company.linkedinUrl}
                                                        onChange={(event) => setCompany({ ...company, linkedinUrl: event.target.value })}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="websiteUrl" className="form-label label-value">Website Url</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="websiteUrl"
                                                        value={company.websiteUrl}
                                                        onChange={(event) => setCompany({ ...company, websiteUrl: event.target.value })}
                                                        placeholder="Website Url"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="profileLink" className="form-label label-value">Profile Link</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="profileLink"
                                                        value={company.profileLink}
                                                        onChange={(event) => setCompany({ ...company, profileLink: event.target.value })}
                                                        placeholder="Profile link"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="bio" className="form-label label-value">Bio</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="bio"
                                                        rows="4"
                                                        value={company.bio}
                                                        onChange={(event) => setCompany({ ...company, bio: event.target.value })}
                                                        placeholder="Write your bio here..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-success mt-4"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card m-4 ms-0 ">
                                <div className="card-body">
                                    <div className="textarea-box">
                                        <textarea
                                            rows="3"
                                            className="form-control mb-3"
                                            value={comment}
                                            onChange={handleCommentChange}
                                            placeholder="Write your comment here..."
                                        ></textarea>
                                        <button
                                            type="button"
                                            className="btn btn-primary mb-3"
                                            onClick={handleCommentSubmit}
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                    <div className="comment-box">
                                        {commentsList.length > 0 && (
                                            <>
                                                {commentsList.map((comment, index) => (
                                                    <div key={index} className="card mb-3">
                                                        <div className="card-body d-flex justify-content-between align-items-center">
                                                            {editingIndex === index ? (
                                                                <div className="w-100">
                                                                    <textarea
                                                                        rows="2"
                                                                        className="form-control mb-3"
                                                                        value={editingComment}
                                                                        onChange={handleEditCommentChange}
                                                                    ></textarea>
                                                                    <button
                                                                        className="btn btn-success me-2"
                                                                        onClick={() => handleEditSubmit(index)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-secondary"
                                                                        onClick={() => setEditingIndex(null)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div>
                                                                        <div className="comment-text mb-2">{comment.text}</div>
                                                                        <div className="comment-timestamp">{comment.timestamp}</div>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-link text-primary me-2"
                                                                            onClick={() => handleCommentEdit(index)}
                                                                        >
                                                                            <i className="fa fa-edit"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-link text-dark"
                                                                            onClick={() => handleCommentDelete(index)}
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
