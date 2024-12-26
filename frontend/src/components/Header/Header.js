import './Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faHome, faSignOutAlt, faUserPlus, faCog } from '@fortawesome/free-solid-svg-icons';

const Header = ({ isAdmin, loggedInEmail, setLoggedInEmail, setIsAdmin}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const showHomeLink = location.pathname === '/login' || location.pathname === '/calendar' || location.pathname === '/signup';

    const handleLogout = () => {
        setLoggedInEmail('');
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userEmail');
        alert("안전하게 로그아웃 되었습니다!");
        navigate('/login');
    };
    
    return (
        <div className="_page">
            <div className="tab_menu">
                <nav className="tab_menu_box">
                    <ul className="list_right">
                        {loggedInEmail && (
                            <li>
                                <p style={{ color: 'white' }}>
                                    {loggedInEmail}님 환영합니다!
                                    {isAdmin && <span className="admin-badge"> (관리자)</span>}
                                </p>
                            </li>
                        )}
                        
                        {showHomeLink && (
                            <li>
                                <Link to="/" className="menu_home">
                                    <FontAwesomeIcon icon={faHome} /> Home
                                </Link>
                            </li>
                        )}

                        {loggedInEmail ? (
                            <>
                                {isAdmin && (
                                    <li>
                                        <Link to="/settings" className="menu_admin">
                                            <FontAwesomeIcon icon={faCog} /> 관리자
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link to="/" onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="menu_v1">
                                        <FontAwesomeIcon icon={faUser} /> Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="menu_v1">
                                        <FontAwesomeIcon icon={faUserPlus} /> Signup
                                    </Link>
                                </li>
                            </>
                        )}
                        
                        <li>
                            <Link to="/calendar" className="menu_v2">
                                <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Header;
