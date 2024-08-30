import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import { useNotification } from "../components/NotificationContext";

export default function ThailandAddCustomer() {
  const [monthOptions, setMonthOptions] = useState([]);
  const monthList = () => {
    // Logic to generate month-year options
    const monthsToAdd = 12;
    let date = new Date();
    date.setDate(1); // Set the day of the month to the 1st to prevent rolling over

    const options = [];
    for (let i = 0; i < monthsToAdd; i++) {
      let monthYear = date.toLocaleDateString('en-us', {
        month: 'long',
        year: 'numeric'
      });
      options.push(monthYear);
      date.setMonth(date.getMonth() + 1);
    }
    
    setMonthOptions(options);
  }
  
  useEffect(()=>{
    monthList()
  },[])

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
    month: "",
    currentLocation: "",
    noOfRooms: "",
    status: "Open"
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
    navigate('/thailand/customer');
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
      month: newEnquiry.month,
      currentLocation: newEnquiry.currentLocation,
      noOfRooms: newEnquiry.noOfRooms,
      date: formatted,
      status: 'Open',
      comments: commentsList.map(comment => ({
        comment_text: comment.text,
        comment_date: comment.timestamp
      }))
    };

    try {
      // Make the POST request to create an enquiry
      const response = await axios.post(`${baseURL}/api/thailand/create-enquiry`, customerData);
      console.log(response.data);
      setCommentsList([]);

      setNewEnquiry({
        name: "",
        email: "",
        phone: "",
        month: "",
        currentLocation: "",
        noOfRooms: "",
        status: "Open"
      })

      navigate('/thailand/customer');
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
                          <label htmlFor="month" className="form-label label-value">Month</label>
                          <select
                            className="form-control"
                            id="month"
                            value={newEnquiry.month}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, month: e.target.value })}
                          >
                            <option value="">Select Country</option>
                            {monthOptions.map((element) => (
                              <option value={element}>{element}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="currentLocation" className="form-label label-value">Current Location</label>
                          <input
                            type="text"
                            className="form-control"
                            id="currentLocation"
                            value={newEnquiry.currentLocation}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, currentLocation: e.target.value })}
                            placeholder="Enter Current Location"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="noOfRooms" className="form-label label-value">No of Rooms</label>
                          <input
                            type="text"
                            className="form-control"
                            id="noOfRooms"
                            value={newEnquiry.noOfRooms}
                            onChange={(e) => setNewEnquiry({ ...newEnquiry, noOfRooms: e.target.value })}
                            placeholder="Enter No of Rooms"
                          />
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
