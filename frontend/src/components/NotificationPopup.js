import React, { useEffect, useRef } from "react";
import { useNotification } from "./NotificationContext";

const NotificationPopup = ({ message, type, visible, onClose, bgColor, color }) => {
  const progressRef = useRef(null);
  const { hideNotification } = useNotification();

  useEffect(() => {
    let timer;
    const animationDuration = 5000;

    if (visible && progressRef.current) {
      progressRef.current.style.transition = `width ${animationDuration}ms linear`;
      progressRef.current.style.width = "100%";
      timer = setTimeout(() => {
        onClose();
      }, animationDuration);
    } else {
      if (progressRef.current) {
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = "0%";
        setTimeout(() => {
          progressRef.current.style.transition = "";
        }, 50);
      }
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [visible, onClose]);

  return (
    <>
      {visible && (
        <div className={`notification-popup ${type}`} style={{ backgroundColor: bgColor, color: color }}>
          <div className="d-flex gap-5 justify-content-between align-items-center">
            <div><span>{message}</span></div>
            <div>
              <button onClick={hideNotification} className="close-btn">
                <i className="fa fa-times-circle pt-2 fa-lg"></i>
              </button>
            </div>
          </div>
          <div ref={progressRef} className="progress-bar"></div>
        </div>
      )}
    </>
  );
};

export default NotificationPopup;
