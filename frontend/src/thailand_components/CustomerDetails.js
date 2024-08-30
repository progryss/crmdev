import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../components/NotificationContext";

function ThailandCustomerDetails({ customer, onBack, countryList }) {

  const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';
  const initialEditValues = {

    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    month: customer.month,
    currentLocation: customer.currentLocation,
    noOfRooms: customer.noOfRooms,
    page_url: customer.page_url,

    date: customer.date,
    status: customer.status,
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
        const response = await axios.delete(`${baseURL}/api/thailand/delete-enquiry/${customer._id}`);
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
      onBack()
    }

  }

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
      const response = await axios.put(`${baseURL}/api/thailand/update-enquiry/${customer._id}`, editableValues, config);
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
            <label className="btn btn-outline-primary" htmlFor="btnradio1">Open</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Qualified" checked={flyObject.status === "Qualified" ? true : false} />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">Qualified</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Unqualified" checked={flyObject.status === "Unqualified" ? true : false} />
            <label className="btn btn-outline-primary" htmlFor="btnradio3">Unqualified</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio4" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Opportunity" checked={flyObject.status === "Opportunity" ? true : false} />
            <label className="btn btn-outline-primary" htmlFor="btnradio4">Opportunity</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio5" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Loss" checked={flyObject.status === "Loss" ? true : false} />
            <label className="btn btn-outline-primary" htmlFor="btnradio5">Lost</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio6" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Won" checked={flyObject.status === "Won" ? true : false} />
            <label className="btn btn-outline-primary" htmlFor="btnradio6">Won</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio7" onClick={(e) => handleChangeStatus('status', e.target.value)} autocomplete="off" value="Spam" checked={flyObject.status === "Spam" ? true : false} />
            <label className="btn btn-outline-primary" htmlFor="btnradio7">Spam</label>
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
                  <div className="label-title">Month:</div>
                  <select
                    className="label-value"
                    value={flyObject.month}
                    onChange={(e) => handleChange('month', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">Select Country</option>
                    {monthOptions.map((element)=>(
                      <option value={element}>{element}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <div className="label-title">Current Location</div>
                  <input className="label-value" onChange={(e) => handleChange('currentLocation', e.target.value)} readOnly={isReadOnly} value={flyObject.currentLocation} />
                </div>
                <div className="mb-4">
                  <div className="label-title">No of Rooms</div>
                  <input className="label-value" onChange={(e) => handleChange('noOfRooms', e.target.value)} readOnly={isReadOnly} value={flyObject.noOfRooms} />
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

export default ThailandCustomerDetails;
