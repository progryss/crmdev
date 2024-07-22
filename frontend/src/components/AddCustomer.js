import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import { useNotification } from "./NotificationContext"; // Adjust the path if necessary

export default function AddCustomer() {
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';

  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  const { showNotification } = useNotification();

  const [newEnquiry, setNewEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    city: "",
    country: "",
    message: "",

    companyName: "",
    website_url: "",
    companyPhone: "",
    size: "",
    rating: "",
    reviews: "",
    minimumProjects: "",
    hourlyRate: "",

    service: "",
    budget: "",
    startFrom: "",
    seoActivity: "",

    status: "open",
    leadSource: ""
  });

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
    navigate('/customer');
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    // Define the enquiry data
    const customerData = {

      name: newEnquiry.name,
      email: newEnquiry.email,
      phone: newEnquiry.phone,
      linkedinUrl: newEnquiry.linkedinUrl,
      city: newEnquiry.city,
      country: newEnquiry.country,
      message: newEnquiry.message,

      companyName: newEnquiry.companyName,
      website_url: newEnquiry.website_url,
      companyPhone: newEnquiry.companyPhone,
      size: newEnquiry.size,
      rating: newEnquiry.rating,
      reviews: newEnquiry.reviews,
      minimumProjects: newEnquiry.minimumProjects,
      hourlyRate: newEnquiry.hourlyRate,

      service: newEnquiry.service,
      budget: newEnquiry.budget,
      startFrom: newEnquiry.startFrom,
      seoActivity: newEnquiry.seoActivity,

      date: formatted,
      status: 'open',
      leadSource: newEnquiry.leadSource,
      comments: commentsList.map(comment => ({
        comment_text: comment.text,
        comment_date: comment.timestamp
      }))
    };

    try {
      // Make the POST request to create an enquiry
      const response = await axios.post(`${baseURL}/api/create-enquiry`, customerData);
      console.log(response.data);
      setCommentsList([]);

      setNewEnquiry({
        name: "",
        email: "",
        phone: "",
        linkedinUrl: "",
        city: "",
        country: "",
        message: "",

        companyName: "",
        website_url: "",
        companyPhone: "",
        size: "",
        rating: "",
        reviews: "",
        minimumProjects: "",
        hourlyRate: "",

        service: "",
        budget: "",
        startFrom: "",
        seoActivity: "",

        status: "open",
        leadSource: ""
      })

      navigate('/customer');
    } catch (error) {
      console.error('Error in sending enquiry:', error);
    }

    // Simulate success notification
    showNotification('Customer added successfully!', 'success', 'green', 'white');
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
                      <h5 className="mb-0"><strong>Add Customer</strong></h5>
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
                      <h6 className="mb-3">User Details</h6>
                      <div className="first-column-box">
                        <div className="mb-4">
                          <label htmlFor="name" className="form-label label-value">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={newEnquiry.name}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                            placeholder="Enter customer's name"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label label-value">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={newEnquiry.email}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="phone" className="form-label label-value">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            value={newEnquiry.phone}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="linkedinUrl" className="form-label label-value">Linkedin URL</label>
                          <input
                            type="text"
                            className="form-control"
                            id="linkedinUrl"
                            value={newEnquiry.linkedinUrl}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, linkedinUrl: e.target.value })}
                            placeholder="Enter Linkedin Url"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="city" className="form-label label-value">City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            value={newEnquiry.city}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, city: e.target.value })}
                            placeholder="Enter City"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="country" className="form-label label-value">Country</label>
                          <select
                            className="form-control"
                            id="country"
                            value={newEnquiry.country}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, country: e.target.value })}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="message" className="form-label label-value">Message</label>
                          <textarea
                            className="form-control"
                            id="message"
                            rows="4"
                            value={newEnquiry.message}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, message: e.target.value })}
                            placeholder="Write your message here..."
                          ></textarea>
                        </div>
                      </div>
                      <h6 className="mb-3">Company Details</h6>
                      <div className="second-column-box">
                        <div className="mb-4">
                          <label htmlFor="companyName" className="form-label label-value">Company Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="companyName"
                            value={newEnquiry.companyName}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, companyName: e.target.value })}
                            placeholder="Enter Company name"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="website_url" className="form-label label-value">Website Url</label>
                          <input
                            type="website_url"
                            className="form-control"
                            id="website_url"
                            value={newEnquiry.website_url}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, website_url: e.target.value })}
                            placeholder="Add website url"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="countryPhone" className="form-label label-value">Country Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="countryPhone"
                            value={newEnquiry.companyPhone}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, companyPhone: e.target.value })}
                            placeholder="Enter Company Phone"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="size" className="form-label label-value">Size</label>
                          <input
                            type="text"
                            className="form-control"
                            id="size"
                            value={newEnquiry.size}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, size: e.target.value })}
                            placeholder="Company Size"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="rating" className="form-label label-value">Rating</label>
                          <input
                            type="text"
                            className="form-control"
                            id="rating"
                            value={newEnquiry.rating}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, rating: e.target.value })}
                            placeholder="Company Rating"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="reviews" className="form-label label-value">Reviews</label>
                          <input
                            type="text"
                            className="form-control"
                            id="reviews"
                            value={newEnquiry.reviews}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, reviews: e.target.value })}
                            placeholder="Company Reviews"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="minimumProjects" className="form-label label-value">Minimum Projects</label>
                          <input
                            type="text"
                            className="form-control"
                            id="minimumProjects"
                            value={newEnquiry.minimumProjects}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, minimumProjects: e.target.value })}
                            placeholder=""
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="hourlyRate" className="form-label label-value">Hourly Rate</label>
                          <input
                            type="text"
                            className="form-control"
                            id="hourlyRate"
                            value={newEnquiry.hourlyRate}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, hourlyRate: e.target.value })}
                            placeholder=""
                          />
                        </div>
                      </div>
                      <h6 className="mb-3">Other Details</h6>
                      <div className="third-column-box">
                        <div className="mb-4">
                          <label htmlFor="service" className="form-label label-value">Services</label>
                          <select
                            className="form-control"
                            id="service"
                            value={newEnquiry.service}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, service: e.target.value })}
                          >
                            <option value="">What are you looking for</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Design">Design</option>
                            <option value="CMS &amp; Platform">CMS &amp; Platform</option>
                            <option value="Web Frameworks">Web Frameworks</option>
                            <option value="Infra &amp; Product Lifecycle">Infra &amp; Product Lifecycle</option>
                            <option value="Next Generation Technology">Next Generation Technology</option>
                            <option value="Mobility">Mobility</option>
                            <option value="Core Engineering">Core Engineering</option>
                            <option value="Retail &amp; Ecommerce">Retail &amp; Ecommerce</option>
                            <option value="Mentainance &amp; Support">Mentainance &amp; Support</option>
                            <option value="SEO">SEO</option>
                            <option value="PPC">PPC</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="budget" className="form-label label-value">Project Budget</label>
                          <select
                            className="form-control"
                            id="budget"
                            value={newEnquiry.budget}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, budget: e.target.value })}
                          >
                            <option value="">Project Budget</option>
                            <option value="2k - 5k USD">2k - 5k USD</option>
                            <option value="5k - 10k USD">5k - 10k USD</option>
                            <option value="10k - 20k USD">10k - 20k USD</option>
                            <option value="20k - 50k USD">20k - 50k USD</option>
                            <option value="50k USD Or Above">50k USD Or Above</option>
                            <option value="Not Sure">Not Sure</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="startFrom" className="form-label label-value">When to start</label>
                          <select
                            className="form-control"
                            id="startFrom"
                            value={newEnquiry.startFrom}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, startFrom: e.target.value })}
                          >
                            <option value="">When to Start</option>
                            <option value="Right Now">Right Now</option>
                            <option value="In Few Weeks">In Few Weeks</option>
                            <option value="In Few Months">In Few Months</option>
                            <option value="Not Sure">Not Sure</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="seoActivity" className="form-label label-value">Seo Activity</label>
                          <select
                            className="form-control"
                            id="seoActivity"
                            value={newEnquiry.seoActivity}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, seoActivity: e.target.value })}
                          >
                            <option value="">How are your SEO activities managed now?</option>
                            <option value="Right Now">Via an Agency</option>
                            <option value="In Few Weeks">In-house Team</option>
                            <option value="In Few Months">SEO activities not initiated yet</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="leadSource" className="form-label label-value">Lead Source:</label>
                          <select
                            className="form-control"
                            id="leadSource"
                            value={newEnquiry.leadSource}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, leadSource: e.target.value })}
                          >
                            <option value="">Select</option>
                            <option value="Website">Website</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="SEO">SEO</option>
                            <option value="PPC">PPC</option>
                            <option value="Linkedin">Linkedin</option>
                            <option value="Clutch">Clutch</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Call">Call</option>

                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success"
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
                                    <div className="comment-text mb-2"><pre style={{ fontFamily: "inherit" }}>{comment.text}</pre></div>
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
