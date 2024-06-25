import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "./NotificationContext"; 

function CustomerDetails({ customer, onBack }) {

  const baseURL = process.env.REACT_APP_SERVER_URL;

  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComment, setEditingComment] = useState("");

  const { showNotification } = useNotification(); 

  const localStorageKey = `comments_${customer.id || customer.name}`;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleEditCommentChange = (e) => {
    setEditingComment(e.target.value);
  };

  const handleCommentSubmit = async () => {

    if (comment.trim() !== "") {
      const now = new Date();
      const timestamp = now.toLocaleString();
      const newComment = { text: comment, timestamp: timestamp };
      const updatedCommentsList = [newComment, ...commentsList];
      setCommentsList(updatedCommentsList);
      setComment("");
      localStorage.setItem(localStorageKey, JSON.stringify(updatedCommentsList));
      
      // Show success notification
      showNotification('Comment added successfully!', 'success', 'green', 'white');
    } else {
      showNotification("Can't be blank!", "error", "red", "white");
    }

    

    try {
      const response = await axios.put(`${baseURL}/update-enquiry/${customer._id}`)
    } catch (error) {
      
    }

  };

  const handleCommentDelete = (index) => {
    const updatedCommentsList = commentsList.filter((_, i) => i !== index);
    setCommentsList(updatedCommentsList);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedCommentsList));
  };

  const handleCommentEdit = (index) => {
    setEditingIndex(index);
    setEditingComment(commentsList[index].text);
  };

  const handleEditSubmit = (index) => {
    if (editingComment.trim() !== "") {
      const updatedCommentsList = commentsList.map((comment, i) =>
        i === index ? { ...comment, text: editingComment } : comment
      );
      setCommentsList(updatedCommentsList);
      setEditingIndex(null);
      setEditingComment("");
      localStorage.setItem(localStorageKey, JSON.stringify(updatedCommentsList));
    }
  };

  const address = customer.address
    ? customer.address.country ||
      customer.address.city ||
      customer.address.street ||
      customer.address.suite ||
      customer.address.zipcode
    : "N/A";

  return (
    <div className="container-fluid customer-details">
      <div className="card mb-3">
        <div className="card-body p-0">
          <div className="bg-light add-cutomer-section px-3 py-4">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span><i className="fa fa-arrow-left" onClick={onBack}></i></span>
                    <span><i className="fas fa-user fa-sm"></i></span>
                    <span>
                      <h5 className="mb-0"><strong>{customer.name}</strong></h5>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-5 align-items-center p-3">
            <div>
              <div className="label-title">Name:</div>
              <div className="label-value">{customer.name}</div>
            </div>
            <div>
              <div className="label-title">Phone Number:</div>
              <div className="label-value">{customer.phone}</div>
            </div>
            <div>
              <div className="label-title">Email:</div>
              <div className="label-value">{customer.email}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3 status-card">
        <div className="card-body">
          <div className="d-flex justify-content-between gap-2">
            <div className="status-card-list">
              <ul>
                <li>Step 1</li>
                <li>Step 2</li>
                <li>Nurturing</li>
                <li>Unqualified</li>
                <li>Converted</li>
              </ul>
            </div>
            <div><button className="btn rounded-pill btn-primary">Mark Status as Complete</button></div>
          </div>
        </div>
      </div>
      <div className="customer-details-grid">
        <div className="card mb-3">
          <div className="card-body">
            <div className="detail-tab-box">
              <h5>Details</h5>
            </div>
            <div className="two-column-layout">
              <div className="first-column-box">
                <div className="mb-4">
                  <div className="label-title">Name:</div>
                  <div className="label-value">{customer.name}</div>
                </div>
                <div className="mb-4">
                  <div className="label-title">Country:</div>
                  <div className="label-value">{customer.country}</div>
                </div>
                <div className="mb-4">
                  <div className="label-title">Message:</div>
                  <div className="label-value">{customer.message || "N/A"}</div>
                </div>
              </div>
              <div className="second-column-box">
                <div className="mb-4">
                  <div className="label-title">Phone Number:</div>
                  <div className="label-value">{customer.phone}</div>
                </div>
                <div className="mb-4">
                  <div className="label-title">Email:</div>
                  <div className="label-value">{customer.email}</div>
                </div>
                <div className="mb-4">
                  <div className="label-title">Page URL:</div>
                  <div className="label-value">{customer.page_url || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-3">
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
                className="btn btn-primary mb-3"
                onClick={handleCommentSubmit}
              >
                Post Comment
              </button>
            </div>
            <div className="comment-box">
              {customer.comments.length > 0 && (
                <>
                  {customer.comments.map((comment, index) => (
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
                              <div className="comment-text mb-2">{comment.comment_text}</div>
                              <div className="comment-timestamp">{comment.comment_date}</div>
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
    </div>
  );
}

export default CustomerDetails;
