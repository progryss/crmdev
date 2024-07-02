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
  const [customerName, setCustomerName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [startFrom, setStartFrom] = useState("");

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
    navigate('/customer');
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    // Define the enquiry data
    const customerData = {
      date: formatted, // Use current date-time
      name: customerName,
      country: country,
      phone: phoneNumber,
      email: email,
      message: message,
      status: 'Open',
      service: service,
      budget: budget,
      startFrom: startFrom,
      page_url: '',
      comments: commentsList.map(comment => ({
        comment_text: comment.text,
        comment_date: comment.timestamp
      }))
    };

    try {
      // Make the POST request to create an enquiry
      const response = await axios.post(`${baseURL}/api/create-enquiry`, customerData);
      console.log('Enquiry sent successfully:', response.data);
      setCustomerName("");
      setEmail("");
      setPhoneNumber("");
      setCountry("");
      setCommentsList([]);
      setMessage("");
      setService("");
      setBudget("");
      setStartFrom("");

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
                      <div className="form-grid-column-one">
                        <div className="mb-4">
                          <label htmlFor="customerName" className="form-label label-value">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            value={customerName}
                            onChange={(event) => setCustomerName(event.target.value)}
                            placeholder="Enter customer's name"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="country" className="form-label label-value">Country</label>
                          <select
                            className="form-control"
                            id="country"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="service" className="form-label label-value">What are you looking for</label>
                          <select
                            className="form-control"
                            id="service"
                            value={service}
                            onChange={(event) => setService(event.target.value)}
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
                          </select>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="startFrom" className="form-label label-value">When to start</label>
                          <select
                            className="form-control"
                            id="startFrom"
                            value={startFrom}
                            onChange={(event) => setStartFrom(event.target.value)}
                          >
                            <option value="">When to Start</option>
                            <option value="Right Now">Right Now</option>
                            <option value="In Few Weeks">In Few Weeks</option>
                            <option value="In Few Months">In Few Months</option>
                            <option value="Not Sure">Not Sure</option>
                          </select>
                        </div>

                      </div>
                      <div className="form-grid-column-two">
                        <div className="mb-4">
                          <label htmlFor="phoneNumber" className="form-label label-value">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label label-value">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="budget" className="form-label label-value">Project Budget</label>
                          <select
                            className="form-control"
                            id="budget"
                            value={budget}
                            onChange={(event) => setBudget(event.target.value)}
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
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label label-value">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="4"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Write your message here..."
                      ></textarea>
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
