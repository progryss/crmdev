import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import './Header.css';

const Header = ({ handleLogout }) => {
    const location = useLocation();

    return (
        <header className="App-header fixed-top custom-header-css">
            <div className="container-fluid">
                <div className='row'>
                    <div className="col-lg-12 my-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <div className="navbar-brand"><img src='progryss-logo.svg' alt='' width='125' /></div>
                            </div>
                            <div className="dropdown">
                                <span className="user-name dropdown-toggle" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                    Admin <i className="fas fa-user-circle"></i>
                                </span>
                                <ul className="dropdown-menu" aria-labelledby="userMenu">
                                    <li> <Link to="/login" onClick={handleLogout}><button className="dropdown-item">Logout</button></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <nav className="navbar navbar-expand-lg p-0 custom-navbar-css gap-3">
                            <div>
                            <i className="fas fa-th fa-2x"></i>
                            </div>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/customer">Customer</NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
