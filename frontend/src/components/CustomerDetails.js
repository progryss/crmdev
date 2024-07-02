import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "./NotificationContext";

function CustomerDetails({ customer, onBack }) {

  const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';
  const initialEditValues = {
    date: customer.date,
    name: customer.name,
    email: customer.email,
    country: customer.country,
    phone: customer.phone,
    message: customer.message,
    page_url: customer.page_url,
    comments: customer.comments,
    service: customer.service,
    budget: customer.budget,
    startFrom: customer.startFrom
  };

  const [comment, setComment] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const { showNotification } = useNotification();
  const [editableValues, setEditableValues] = useState(initialEditValues);
  const [flyObject, setFlyObject] = useState(initialEditValues);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentDelete = (index) => {
    editableValues.comments.splice(index, 1);
    console.log(editableValues.comments)
    setEditableValues((object) => ({
      ...object,
      comments: editableValues.comments
    }))
  };

  const editEnquiry = () => {
    console.log('edit start');
    setIsReadOnly(false);
  }

  const saveEnquiry = async () => {
    console.log('enquiry save');
    setEditableValues(flyObject)
    setIsReadOnly(true);
  }

  const handleChange = (field, value) => {
    setFlyObject(prev => ({ ...prev, [field]: value }));
  };

  const cancelEdit = () => {
    setFlyObject(initialEditValues);
    setIsReadOnly(true);
  }

  const deleteQuery = async () => {

    const userResponse = window.confirm("Are you sure you want to delete?");
    if (userResponse) {
      try {
        const response = await axios.delete(`${baseURL}/api/delete-enquiry/${customer._id}`);
        console.log(response)
      } catch (error) {
        console.log(error)
      }
      onBack()
    }

  }

  useEffect(() => {
    console.log('useeffect')
    hit()
  }, [editableValues])

  async function hit() {
    console.log(editableValues)
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.put(`${baseURL}/api/update-enquiry/${customer._id}`, editableValues, config);
      console.log(response);
    } catch (error) {
      console.log('Error sending PUT request', error);
    }
  }

  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      const now = new Date();
      const timestamp = now.toLocaleString();
      const newComment = { comment_text: comment, comment_date: timestamp };
      const updatedCommentsList = [newComment, ...editableValues.comments];

      setEditableValues((object) => ({
        ...object,
        comments: updatedCommentsList
      }));

      setComment("");
      showNotification('Comment added successfully!', 'success', 'green', 'white');
    } else {
      showNotification("Can't be blank!", "error", "red", "white");
    }
  };

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
          <div className="d-flex gap-5 p-3">
            <div>
              <div className="label-title">Name:</div>
              <div className="label-value">{flyObject.name}</div>
            </div>
            <div>
              <div className="label-title">Phone Number:</div>
              <div className="label-value">
                <a href={`https://wa.me/${flyObject.phone}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4199FD' }}>
                  {flyObject.phone}
                </a>
              </div>
            </div>
            <div>
              <div className="label-title">Email:</div>
              <div className="label-value">
                <a href={`mailto:${flyObject.email}`} style={{ textDecoration: 'none', color: '#4199FD' }}>
                  {flyObject.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3 status-card">
        <div className="card-body">
          <div className="d-flex justify-content-between gap-2">
            <div className="status-card-list">
              <ul>
                <li>Open</li>
                <li>Qualified</li>
                <li>Closed</li>
              </ul>
            </div>
            <div><button className="btn btn-primary">Mark status as Completed</button></div>
          </div>
        </div>
      </div>
      <div className="customer-details-grid">
        <div className="card mb-3">
          <div className="card-body">
            <div className="detail-tab-box d-flex justify-content-between pb-2">
              <div>
                <span>Details</span>
              </div>
              <div>

                {!isReadOnly ? (<><button className="btn btn-primary me-2 btn-sm" onClick={cancelEdit}>Cancel</button><button className="btn btn-primary me-2 saveBtn btn-sm" onClick={saveEnquiry}>Update</button></>) : (<><button className='btn btn-link me-2 updateBtn' onClick={editEnquiry}><i className="fa fa-edit"></i></button><button className="btn btn-link text-danger me-2 deleteBtn" onClick={deleteQuery}><i className="fa fa-trash"></i></button></>)}
              </div>
            </div>
            <div className="two-column-layout">
              <div className="first-column-box">
                <div className="mb-4">
                  <div className="label-title">Name:</div>
                  <input className="label-value" onChange={(e) => handleChange('name', e.target.value)} value={flyObject.name} readOnly={isReadOnly} />
                </div>

                <div className="mb-4">
                  <div className="label-title">Country:</div>
                  <select
                    className="label-value"
                    value={flyObject.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="mb-4">
                  <div className="label-title">Service:</div>
                  <select
                    className="label-value"
                    value={flyObject.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    disabled={isReadOnly}
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
                  <div className="label-title">When to start:</div>
                  <select
                    className="label-value"
                    value={flyObject.startFrom}
                    onChange={(e) => handleChange('startFrom', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">When to Start</option>
                    <option value="Right Now">Right Now</option>
                    <option value="In Few Weeks">In Few Weeks</option>
                    <option value="In Few Months">In Few Months</option>
                    <option value="Not Sure">Not Sure</option>
                  </select>
                </div>

              </div>
              <div className="second-column-box">
                <div className="mb-4">
                  <div className="label-title">Phone Number:</div>
                  <input className="label-value" onChange={(e) => handleChange('phone', e.target.value)} readOnly={isReadOnly} value={flyObject.phone} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Email:</div>
                  <input className="label-value" onChange={(e) => handleChange('email', e.target.value)} readOnly={isReadOnly} value={flyObject.email} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Page URL:</div>
                  <input className="label-value" onChange={(e) => handleChange('page_url', e.target.value)} readOnly={isReadOnly} value={flyObject.page_url || ""} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Project Budget:</div>
                  <select
                    className="label-value"
                    value={flyObject.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    disabled={isReadOnly}
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
              <div className="label-title">Message:</div>
              <textarea style={{ overflowY: 'scroll' }} rows="5" className="label-value" onChange={(e) => handleChange('message', e.target.value)} readOnly={isReadOnly} value={flyObject.message || ""} />
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
              {editableValues.comments.length > 0 && (
                <>
                  {editableValues.comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body pb-1">

                        <div>
                          <div className="comment-text mb-2">{comment.comment_text}</div>
                          <hr className="m-0 mt-3 mb-2" />
                          <div className="comment-timestamp d-flex justify-content-between align-items-baseline">
                            <div>
                              <span className="fs-12">{comment.comment_date}</span>
                            </div>
                            <div>
                              <button className="btn btn-link text-danger" onClick={(e) => handleCommentDelete(index)}><i className="fa fa-trash"></i></button>
                            </div>
                          </div>
                        </div>

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
