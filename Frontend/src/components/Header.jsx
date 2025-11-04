import React from 'react';
import { Briefcase, Building2, Heart, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import authService from '@/features/auth/authService'; 

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const isLoggedIn = !!cookies.token;

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        authService.logout(); 
        removeCookie('token', { path: '/' });
        navigate('/login');
    };

    return (
        <header className='header'>
            <div className='logo'>
                <Briefcase className="icon-logo" />
                <span>JobFair 2022</span>
            </div>
            {isLoggedIn && (
                <>
                    {/* Navigation Links */}
                    <div className="group-btn">
                        <Link 
                            to="/companies"
                            className={`btn ${isActive("/companies") ? "btn-default" : "btn-ghost"}`}
                        >
                            <Building2 className="icon-company" />
                            <span>Companies</span>
                        </Link>

                        <Link 
                            to="/favorites"
                            className={`btn ${isActive("/favorites") ? "btn-default" : "btn-ghost"}`}
                        >
                            <Heart className="icon-fav" />
                            <span>Favorites</span>
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-logout"
                    >
                        <LogOut className="icon-logout" />
                        <span>Logout</span>
                    </button>
                </>
            )}
        </header>
    );
}

export default Header;