import React, { createContext, useState, useContext } from 'react';
import NotificationPopup from './NotificationPopup'; 

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type, bgColor, color) => {
    setNotification({ message, type, bgColor, color });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          bgColor={notification.bgColor}
          color={notification.color}
          onClose={hideNotification}
          visible={true}
        />
      )}
    </NotificationContext.Provider>
  );
};
