// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import Customer from './components/Customer'; 
import Database from './components/Database';
import LoginPage from './components/LoginPage'; 
import { NotificationProvider } from './components/NotificationContext'; 
import AddCustomer from './components/AddCustomer';
import AddCompany from './components/AddCompany';

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
                    <Route path="/add-company" element={<AddCompany />} />
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/customer" : "/login"} />} />
                    <Route path="/database" element={isLoggedIn ? <Database /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
