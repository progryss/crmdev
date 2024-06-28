// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header'; // Assuming Header.js is in ./components/Header.js
import './App.css';
import Customer from './components/Customer'; // Assuming Customer.js is in ./components/Customer.js
import LoginPage from './components/LoginPage'; // Assuming LoginPage.js is in ./components/LoginPage.js
import { NotificationProvider } from './components/NotificationContext'; // Adjusted path
import AddCustomer from './components/AddCustomer';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isAppInitialized = sessionStorage.getItem('isAppInitialized');

        if (!isAppInitialized) {
            localStorage.setItem('isLoggedIn', 'false');
            sessionStorage.setItem('isAppInitialized', 'true');
            setIsLoggedIn(false);
        } else {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <NotificationProvider> {/* Wrap the Router with NotificationProvider */}
            <Router>
                <div className="App">
                    <AppContent isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
                </div>
            </Router>
        </NotificationProvider>
    );
}

function AppContent({ isLoggedIn, handleLogin, handleLogout }) {
    const location = useLocation();

    const shouldDisplayHeader = () => {
        return !location.pathname.startsWith('/login');
    };

    return (
        <>
            {shouldDisplayHeader() && <Header handleLogout={handleLogout} />}
            <main className="main-content-css">
                <Routes>
                    <Route path="/" element={<Navigate to={isLoggedIn ? "/customer" : "/login"} />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/customer" /> : <LoginPage handleLogin={handleLogin} />} />
                    <Route path="/customer" element={isLoggedIn ? <Customer /> : <Navigate to="/login" />} />
                    <Route path="/add-enquiry" element={<AddCustomer />} />
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/customer" : "/login"} />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
