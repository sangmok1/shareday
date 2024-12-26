import './HeaderNavi.css';
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const HeaderNavi = ({ isAdmin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };
    
    return (
        <section className="locations">
            <div className="locations-contaniner-font">
                <div className="logo-front"><p>오늘완전</p></div>
            </div>
            <div className="locations-contaniner">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="locations-main">
                <h1>Daily Anniversary Birthday Wedding Sadness</h1>
            </div>
            <div className="hamburger-menu" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={`locations-main-menu ${isMenuOpen ? 'active' : ''}`}>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/bake" className="navi_v1">앨범제작</Link></li>
                        <li><Link to="/photobooth" className="navi_v2">4컷사진</Link></li>
                        <li><Link to="/#" className="navi_v6">배경제거</Link></li>
                        <li><Link to="/#" className="navi_v3">구경하기</Link></li>
                        <li><Link to="/notice" className="navi_v4">소식/공지</Link></li>
                        {isLoggedIn && isAdmin && (
                            <li><Link to="/settings" className="navi_v5">Settings</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </section>
    );
}

export default HeaderNavi;
