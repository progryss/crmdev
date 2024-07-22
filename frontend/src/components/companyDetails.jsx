import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "./NotificationContext";

function CompanyDetails({ company, onBack }) {

    const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';
    const initialEditValues = {
        date: company.date,
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
        comments: company.comments,
        status : company.status
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
        // console.log('editing saved');
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

    const deleteCompany = async () => {
        const userResponse = window.confirm("Are you sure you want to delete this company?");
        if (userResponse) {
            try {
                await axios.delete(`${baseURL}/api/delete-company/${company._id}`);
                console.log('company deleted successfully')
            } catch (error) {
                console.log("error in deleting company", error)
            }
            onBack()
        }
    }

    useEffect(() => {
        // console.log('useeffect')
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
            const response = await axios.put(`${baseURL}/api/update-company/${company._id}`, editableValues, config);
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

    const capitalizeStr = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                                            <h5 className="mb-0"><strong>{company.companyName}</strong></h5>
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
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="open" checked={flyObject.status === "open" ? true : false} />
                        <label className="btn btn-outline-primary" for="btnradio1">Open</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="qualified" checked={flyObject.status === "qualified" ? true : false}/>
                        <label className="btn btn-outline-primary" for="btnradio2">Qualified</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="unqualified" checked={flyObject.status === "unqualified" ? true : false}/>
                        <label className="btn btn-outline-primary" for="btnradio3">Unqualified</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio4" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="opportunity" checked={flyObject.status === "opportunity" ? true : false}/>
                        <label className="btn btn-outline-primary" for="btnradio4">Opportunity</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio5" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="loss" checked={flyObject.status === "loss" ? true : false}/>
                        <label className="btn btn-outline-primary" for="btnradio5">Lost</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio6" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="won" checked={flyObject.status === "won" ? true : false}/>
                        <label className="btn btn-outline-primary" for="btnradio6">Won</label>

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio7" onClick={(e)=> handleChangeStatus('status',e.target.value)} autocomplete="off" value="span" checked={flyObject.status === "span" ? true : false}/>
                        <label className="btn btn-outline-primary" for="btnradio7">Spam</label>
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

                                {!isReadOnly ? (<><button className="btn btn-primary me-2 btn-sm" onClick={cancelEdit}>Cancel</button><button className="btn btn-primary me-2 saveBtn btn-sm" onClick={saveEnquiry}>Update</button></>) : (<><button className='btn btn-link me-2 updateBtn' onClick={editEnquiry}><i className="fa fa-edit"></i></button><button className="btn btn-link text-danger me-2 deleteBtn" onClick={deleteCompany}><i className="fa fa-trash"></i></button></>)}
                            </div>
                        </div>
                        <div className="two-column-layout">
                            <div className="first-column-box">
                                <div className="mb-4">
                                    <div className="label-title">Company Name:</div>
                                    <input className="label-value" onChange={(e) => handleChange('companyName', e.target.value)} value={flyObject.companyName} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">City:</div>
                                    <input className="label-value" onChange={(e) => handleChange('city', e.target.value)} value={flyObject.city} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Country:</div>
                                    <select
                                        className="label-value"
                                        value={capitalizeStr(flyObject.country)}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Rating:</div>
                                    <input className="label-value" onChange={(e) => handleChange('rating', e.target.value)} value={flyObject.rating} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Reviews:</div>
                                    <input className="label-value" onChange={(e) => handleChange('reviews', e.target.value)} value={flyObject.reviews} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Minimum Projects:</div>
                                    <input className="label-value" onChange={(e) => handleChange('minimumProjects', e.target.value)} value={flyObject.minimumProjects} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Hourly Rates:</div>
                                    <input className="label-value" onChange={(e) => handleChange('hourlyRate', e.target.value)} value={flyObject.hourlyRate} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Size:</div>
                                    <input className="label-value" onChange={(e) => handleChange('size', e.target.value)} value={flyObject.size} readOnly={isReadOnly} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Services Provided:</div>
                                    <input className="label-value" onChange={(e) => handleChange('servicesProvided', e.target.value)} value={flyObject.servicesProvided} readOnly={isReadOnly} />
                                </div>

                            </div>
                            <div className="second-column-box">
                                <div className="mb-4">
                                    <div className="label-title">Name:</div>
                                    <input className="label-value" onChange={(e) => handleChange('name', e.target.value)} readOnly={isReadOnly} value={flyObject.name} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Phone Number:</div>
                                    <input className="label-value" onChange={(e) => handleChange('phone', e.target.value)} readOnly={isReadOnly} value={flyObject.phone} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Email:</div>
                                    <input className="label-value" onChange={(e) => handleChange('email', e.target.value)} readOnly={isReadOnly} value={flyObject.email} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Website Url:</div>
                                    <input className="label-value" onChange={(e) => handleChange('websiteUrl', e.target.value)} readOnly={isReadOnly} value={flyObject.websiteUrl} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Linkedin Url:</div>
                                    <input className="label-value" onChange={(e) => handleChange('linkedinUrl', e.target.value)} readOnly={isReadOnly} value={flyObject.linkedinUrl} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Profile Link:</div>
                                    <input className="label-value" onChange={(e) => handleChange('profileLink', e.target.value)} readOnly={isReadOnly} value={flyObject.profileLink} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Bio:</div>
                                    <textarea style={{ overflowY: 'scroll' }} rows="5" className="label-value" onChange={(e) => handleChange('bio', e.target.value)} readOnly={isReadOnly} value={flyObject.bio || ""} />
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

export default CompanyDetails;
