import {useState,useEffect} from 'react'
import { Link, useNavigate, useRoutes} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faBars, faHome, faPuzzlePiece, faGear, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'

import decode from 'jwt-decode';

import './../Styles/Navbar.scss';

function Navbar(){

    const [user, setUser] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const url = window.location.pathname;

    const nav = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem('auth');
        
        if(token){
            setUser(decode(token).email);
        }
        else{
            nav("/");
        }
    }, []);
    
    function logout(){
        localStorage.clear("auth");
    
        setUser("");
    
        nav("/");
    }

    function openNavMenu(){
        setMenuOpen(!menuOpen);
    }

    function openUserMenu(){
        setUserMenuOpen(!userMenuOpen);
    }

    return(
        <nav>
            <div style={{visibility: menuOpen ? "visible" : "hidden"}} className='nav-menu-container'>
                <div className='nav-menu'>
                    <Link to="/">
                        <div style={url === "/" ? {backgroundColor:"#2A5C2D"} : {}} className='nav-menu-item'>
                            <FontAwesomeIcon icon={faHome}/>
                            <span>Home</span>
                        </div>
                    </Link>
                    <Link to="/modules">
                        <div style={url === "/modules" ? {backgroundColor:"#2A5C2D"} : {}} className='nav-menu-item'>
                            <FontAwesomeIcon icon={faPuzzlePiece}/>
                            <span>Modules</span>
                        </div>
                    </Link>
                    <Link to="/">
                    <div className='nav-menu-item'>
                        <FontAwesomeIcon icon={faUser}/>
                        <span>Instructors</span>
                    </div>
                    </Link>
                    <Link to="/sections">
                    <div className='nav-menu-item'>
                        <FontAwesomeIcon icon={faUsers}/>
                        <span>Sections</span>
                    </div>
                    </Link>
                    <Link to="/">
                    <div className='nav-menu-item'>
                        <FontAwesomeIcon icon={faGear}/>
                        <span>Settings</span>
                    </div>
                    </Link>
                </div>
            </div>
            <FontAwesomeIcon className='menu-icon' icon={faBars} onClick={openNavMenu}/>
            <Link to='/'><span className='logo'>LearnMode</span></Link>
            <div className='emptyspace'></div>
            <i className="fa-solid fa-bars"></i>
            <div className='user' onClick={openUserMenu}>{user} <FontAwesomeIcon icon={faCaretDown}/></div>
            {userMenuOpen &&
                <div className='user-menu-container'>
                    <div className='user-menu' onClick={logout}>Logout</div>
                </div>
            }
        </nav>
    )
}

export default Navbar;