// App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import Customer from './components/Customer';
import Database from './components/Database';
import LoginPage from './components/LoginPage';
import { NotificationProvider } from './components/NotificationContext';
import AddCustomer from './components/AddCustomer';
import AddCompany from './components/AddCompany';
import Opportunity from './components/opportunity';


import ThailandHeader from './thailand_components/Header';
import ThailandCustomer from './thailand_components/Customer';
import ThailandLoginPage from './thailand_components/LoginPage';
import ThailandAddCustomer from './thailand_components/AddCustomer';
import ThailandOpportunity from './thailand_components/opportunity';


export default function App() {

    const location = useLocation();

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
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    }

    const [isLoggedInThailand, setIsLoggedInThailand] = useState(false);

    useEffect(() => {
        const isAppInitializedThailand = sessionStorage.getItem('isAppInitializedThailand');

        if (!isAppInitializedThailand) {
            localStorage.setItem('isLoggedInThailand', 'false');
            sessionStorage.setItem('isAppInitializedThailand', 'true');
            setIsLoggedInThailand(false);
        } else {
            const loggedInThailand = localStorage.getItem('isLoggedInThailand') === 'true';
            setIsLoggedInThailand(loggedInThailand);
        }
    }, []);

    const handleLoginThailand = () => {
        setIsLoggedInThailand(true);
        localStorage.setItem('isLoggedInThailand', 'true');
    };

    const handleLogoutThailand = () => {
        setIsLoggedInThailand(false);
        localStorage.setItem('isLoggedInThailand', 'false');
    };


    
    return (
        <NotificationProvider>
                <div className="App">
                    {location.pathname.startsWith('/thailand') ? <AppContentThailand isLoggedIn={isLoggedInThailand} handleLogin={handleLoginThailand} handleLogout={handleLogoutThailand} /> : <AppContent isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />}
                </div>
        </NotificationProvider>
    );
}

function AppContent({ isLoggedIn, handleLogin, handleLogout }) {
    const location = useLocation();
    const countryListRaw = 'India,United Kingdom,United States,Australia,Ireland,Afghanistan,Aland Islands,Albania,Algeria,American Samoa,Andorra,Angola,Anguilla,Antarctica,Antigua and Barbuda,Argentina,Armenia,Aruba,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bermuda,Bhutan,Bolivia,Bonaire, Saint Eustatius and Saba,Bosnia and Herzegovina,Botswana,Bouvet Island,Brazil,British Indian Ocean Territory,British Virgin Islands,Brunei,Bulgaria,Burkina Faso,Burundi,Cambodia,Cameroon,Canada,Cape Verde,Cayman Islands,Central African Republic,Chad,Chile,China,Christmas Island,Cocos Islands,Colombia,Comoros,Cook Islands,Costa Rica,Croatia,Cuba,Curacao,Cyprus,Czech Republic,Democratic Republic of the Congo,Denmark,Djibouti,Dominica,Dominican Republic,East Timor,Ecuador,Egypt,El Salvador,Equatorial Guinea,Eritrea,Estonia,Ethiopia,Falkland Islands,Faroe Islands,Fiji,Finland,France,French Guiana,French Polynesia,French Southern Territories,Gabon,Gambia,Georgia,Germany,Ghana,Gibraltar,Greece,Greenland,Grenada,Guadeloupe,Guam,Guatemala,Guernsey,Guinea,Guinea-Bissau,Guyana,Haiti,Heard Island and McDonald Islands,Honduras,Hong Kong,Hungary,Iceland,Indonesia,Iran,Iraq,Isle of Man,Israel,Italy,Ivory Coast,Jamaica,Japan,Jersey,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Liechtenstein,Lithuania,Luxembourg,Macao,Macedonia,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Marshall,Islands,Martinique,Mauritania,Mauritius,Mayotte,Mexico,Micronesia,Moldova,Monaco,Mongolia,Montenegro,Montserrat,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,New Caledonia,New Zealand,Nicaragua,Niger,Nigeria,Niue,Norfolk Island,North Korea,Northern Mariana Islands,Norway,Oman,Pakistan,Palau,Palestinian Territory,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Pitcairn,Poland,Portugal,Puerto Rico,Qatar,Republic of the Congo,Reunion,Romania,Russia,Rwanda,Saint Barthelemy,Saint Helena,Saint Kitts and Nevis,Saint Lucia,Saint Martin,Saint Pierre and Miquelon,Saint Vincent and the Grenadines,Samoa,San Marino,Sao Tome and Principe,Saudi Arabia,Senegal,Serbia,Seychelles,Sierra Leone,Singapore,Sint Maarten,Slovakia,Slovenia,Solomon Islands,Somalia,South Africa,South Georgia and the South Sandwich Islands,South Korea,South Sudan,Spain,Sri Lanka,Sudan,Suriname,Svalbard and Jan Mayen,Swaziland,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Togo,Tokelau,Tonga,Trinidad and Tobago,Tunisia,Turkey,Turkmenistan,Turks and Caicos Islands,Tuvalu,U.S. Virgin Islands,Uganda,Ukraine,United Arab Emirates,United States Minor Outlying Islands,Uruguay,Uzbekistan,Vanuatu,Vatican,Venezuela,Vietnam,Wallis and Futuna,Western Sahara,Yemen,Zambia,Zimbabwe';
    const countryList = countryListRaw.split(',');
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
                    <Route path="/customer" element={isLoggedIn ? <Customer countryList={countryList} /> : <Navigate to="/login" />} />
                    <Route path="/add-enquiry" element={<AddCustomer countryList={countryList} />} />
                    <Route path="/add-company" element={<AddCompany countryList={countryList} />} />
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/customer" : "/login"} />} />
                    <Route path="/database" element={isLoggedIn ? <Database countryList={countryList} /> : <Navigate to="/login" />} />
                    <Route path="/opportunity" element={isLoggedIn ? <Opportunity countryList={countryList} /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </>
    );
}

function AppContentThailand({ isLoggedIn, handleLogin, handleLogout }) {
    const location = useLocation();
    const shouldDisplayHeader = () => {
        return !location.pathname.startsWith('/thailand/login');
    };

    return (
        <>
            {shouldDisplayHeader() && <ThailandHeader handleLogout={handleLogout} />}
            <main className="main-content-css">
                <Routes>
                    <Route path="/thailand" element={<Navigate to={isLoggedIn ? "/thailand/customer" : "/thailand/login"} />} />
                    <Route path="/thailand/login" element={isLoggedIn ? <Navigate to="/thailand/customer" /> : <ThailandLoginPage handleLogin={handleLogin} />} />
                    <Route path="/thailand/customer" element={isLoggedIn ? <ThailandCustomer /> : <Navigate to="/thailand/login" />} />
                    <Route path="/thailand/add-enquiry" element={<ThailandAddCustomer />} />
                    <Route path="/thailand/*" element={<Navigate to={isLoggedIn ? "/thailand/customer" : "/thailand/login"} />} />
                    <Route path="/thailand/opportunity" element={isLoggedIn ? <ThailandOpportunity /> : <Navigate to="/thailand/login" />} />
                </Routes>
            </main>
        </>
    );
}

