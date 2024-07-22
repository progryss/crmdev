import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "./NotificationContext";

function CustomerDetails({ customer, onBack }) {

  const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';
  const initialEditValues = {

    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    linkedinUrl: customer.linkedinUrl,
    city: customer.city,
    country: customer.country,
    message: customer.message,

    companyName: customer.companyName,
    companyPhone: customer.companyPhone,
    website_url: customer.website_url,
    size: customer.size,
    rating: customer.rating,
    reviews: customer.reviews,
    minimumProjects: customer.minimumProjects,
    hourlyRate: customer.hourlyRate,

    page_url: customer.page_url,
    service: customer.service,
    budget: customer.budget,
    startFrom: customer.startFrom,
    seoActivity: customer.seoActivity,

    date: customer.date,
    status: customer.status,
    leadSource: customer.leadSource,
    comments: customer.comments
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
    // console.log(editableValues.comments)
    setEditableValues((object) => ({
      ...object,
      comments: editableValues.comments
    }))
  };

  const editEnquiry = () => {
    // console.log('edit start');
    setIsReadOnly(false);
  }

  const saveEnquiry = async () => {
    // console.log('enquiry save');
    setEditableValues(flyObject)
    setIsReadOnly(true);
  }

  const handleChange = (field, value) => {
    setFlyObject(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeStatus = (field, value) => {
    setFlyObject(prev => ({ ...prev, [field]: value }));
    setEditableValues(prev => ({ ...prev, [field]: value }))
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
        console.log(response.data)
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
    // console.log(editableValues)
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.put(`${baseURL}/api/update-enquiry/${customer._id}`, editableValues, config);
      console.log(response.data);
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
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Open" checked={flyObject.status === "Open" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio1">Open</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Qualified" checked={flyObject.status === "Qualified" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio2">Qualified</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Unqualified" checked={flyObject.status === "Unqualified" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio3">Unqualified</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio4" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Opportunity" checked={flyObject.status === "Opportunity" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio4">Opportunity</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio5" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Loss" checked={flyObject.status === "Loss" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio5">Lost</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio6" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Won" checked={flyObject.status === "Won" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio6">Won</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio7" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Spam" checked={flyObject.status === "Spam" ? true : false} />
            <label className="btn btn-outline-primary" for="btnradio7">Spam</label>
          </div>
          <div className="leadWrapper">
            <div className="label-title">Lead Source:</div>
            <select
              className="label-value"
              value={flyObject.leadSource}
              // onChange={(e) => handleChange('leadSource', e.target.value)}
              // disabled={isReadOnly}
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

      <div className="customer-details-grid">
        <div className="card mb-3">
          <div className="card-body">
            <div className="detail-tab-box d-flex justify-content-between pb-2">
              <div></div>
              <div>
                {!isReadOnly ? (<><button className="btn btn-primary me-2 btn-sm" onClick={cancelEdit}>Cancel</button><button className="btn btn-primary me-2 saveBtn btn-sm" onClick={saveEnquiry}>Update</button></>) : (<><button className='btn btn-link me-2 updateBtn' onClick={editEnquiry}><i className="fa fa-edit"></i></button><button className="btn btn-link text-danger me-2 deleteBtn" onClick={deleteQuery}><i className="fa fa-trash"></i></button></>)}
              </div>
            </div>
            <div className="two-column-layout">
              <h6 className="mb-3">User Details</h6>
              <div className="first-column-box">
                <div className="mb-4">
                  <div className="label-title">Name:</div>
                  <input className="label-value" onChange={(e) => handleChange('name', e.target.value)} value={flyObject.name} readOnly={isReadOnly} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Email:</div>
                  <input className="label-value" onChange={(e) => handleChange('email', e.target.value)} readOnly={isReadOnly} value={flyObject.email} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Phone Number:</div>
                  <input className="label-value" onChange={(e) => handleChange('phone', e.target.value)} readOnly={isReadOnly} value={flyObject.phone} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Linkedin URL:</div>
                  <input className="label-value" onChange={(e) => handleChange('linkedinUrl', e.target.value)} readOnly={isReadOnly} value={flyObject.linkedinUrl} />
                </div>
                <div className="mb-4">
                  <div className="label-title">City:</div>
                  <input className="label-value" onChange={(e) => handleChange('city', e.target.value)} readOnly={isReadOnly} value={flyObject.city} />
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
                  <div className="label-title">Message:</div>
                  <textarea style={{ overflowY: 'scroll' }} rows="3" className="label-value" onChange={(e) => handleChange('message', e.target.value)} readOnly={isReadOnly} value={flyObject.message || ""} />
                </div>
              </div>
              <h6 className="mb-3">Company Details</h6>
              <div className="second-column-box">
                <div className="mb-4">
                  <div className="label-title">Company Name:</div>
                  <input className="label-value" onChange={(e) => handleChange('companyName', e.target.value)} readOnly={isReadOnly} value={flyObject.companyName} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Website Url:</div>
                  <input className="label-value" onChange={(e) => handleChange('website_url', e.target.value)} readOnly={isReadOnly} value={flyObject.website_url} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Company Phone:</div>
                  <input className="label-value" onChange={(e) => handleChange('companyPhone', e.target.value)} readOnly={isReadOnly} value={flyObject.companyPhone} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Company Size:</div>
                  <input className="label-value" onChange={(e) => handleChange('size', e.target.value)} readOnly={isReadOnly} value={flyObject.size} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Rating:</div>
                  <input className="label-value" onChange={(e) => handleChange('rating', e.target.value)} readOnly={isReadOnly} value={flyObject.rating} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Reviews:</div>
                  <input className="label-value" onChange={(e) => handleChange('reviews', e.target.value)} readOnly={isReadOnly} value={flyObject.reviews} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Minimum Projects:</div>
                  <input className="label-value" onChange={(e) => handleChange('minimumProjects', e.target.value)} readOnly={isReadOnly} value={flyObject.minimumProjects} />
                </div>
                <div className="mb-4">
                  <div className="label-title">Hourly Rate:</div>
                  <input className="label-value" onChange={(e) => handleChange('hourlyRate', e.target.value)} readOnly={isReadOnly} value={flyObject.hourlyRate} />
                </div>
              </div>
              <h6 className="mb-3">Other Details</h6>
              <div className="third-column-box">
                
                <div className="mb-4">
                  <div className="label-title">Services:</div>
                  <select
                    className="label-value"
                    value={flyObject.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">What are you looking for</option>
                    <option value="Shopify Development">Shopify Development</option>
                    <option value="SEO (Search Engine Optimization)">SEO (Search Engine Optimization)</option>
                    <option value="PPC (Pay Per Click)">PPC (Pay Per Click)</option>
                    <option value="SMM (Social Media Marketing)">SMM (Social Media Marketing)</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Design">Design</option>
                    <option value="CMS & Platform">CMS & Platform</option>
                    <option value="Web Frameworks">Web Frameworks</option>
                    <option value="Infra & Product Lifecycle">Infra & Product Lifecycle</option>
                    <option value="Next Generation Technology">Next Generation Technology</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Retail & Ecommerce">Retail & Ecommerce</option>
                    <option value="Mentainance & Support">Mentainance & Support</option>
                  </select>
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
                <div className="mb-4">
                  <div className="label-title">Seo Activity:</div>
                  <select
                    className="label-value"
                    value={flyObject.seoActivity}
                    onChange={(e) => handleChange('seoActivity', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">How are your SEO activities managed now?</option>
                    <option value="Right Now">Via an Agency</option>
                    <option value="In Few Weeks">In-house Team</option>
                    <option value="In Few Months">SEO activities not initiated yet</option>
                  </select>
                </div>
                <div className="mb-4">
                  <div className="label-title">Page URL:</div>
                  <textarea className="label-value" rows="3" onChange={(e) => handleChange('page_url', e.target.value)} readOnly={isReadOnly} value={flyObject.page_url} />
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
              {editableValues.comments.length > 0 && (
                <>
                  {editableValues.comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body pb-1">

                        <div>
                          <div className="comment-text mb-2"><pre style={{ fontFamily: "inherit" }}>{comment.comment_text}</pre></div>
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
