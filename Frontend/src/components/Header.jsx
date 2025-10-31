import { Briefcase, Building2, Heart } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <header className='header'>
            <div className='logo'>
                <Briefcase className="icon-logo" />
                <span>JobFair 2022</span>
            </div>
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
        </header>
    );
}

export default Header;