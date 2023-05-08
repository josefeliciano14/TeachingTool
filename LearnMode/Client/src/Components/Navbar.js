import {useState,useEffect} from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faBars, faPuzzlePiece, faGear, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { BASE_URL } from '../api';

import decode from 'jwt-decode';

import styles from './../Styles/Navbar.module.scss';

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
            nav("/login");
        }
    }, []);
    
    function logout(){
        localStorage.clear("auth");
    
        setUser("");
    
        nav("/login");
    }

    function openNavMenu(){
        setMenuOpen(!menuOpen);
    }

    function openUserMenu(){
        setUserMenuOpen(!userMenuOpen);
    }

    return(
        <nav>
            <div style={{visibility: menuOpen ? "visible" : "hidden"}} className={styles.navMenuContainer}>
                <div className={styles.navMenu}>
                    <Link to="/">
                        <div style={url === "/" ? {backgroundColor:"#2A5C2D"} : {}} className={styles.navMenuItem}>
                            <FontAwesomeIcon icon={faPuzzlePiece}/>
                            <span>Modules</span>
                        </div>
                    </Link>
                    <Link to="/instructors">
                    <div className={styles.navMenuItem}>
                        <FontAwesomeIcon icon={faUser}/>
                        <span>Instructors</span>
                    </div>
                    </Link>
                    <Link to="/sections">
                    <div className={styles.navMenuItem}>
                        <FontAwesomeIcon icon={faUsers}/>
                        <span>Sections</span>
                    </div>
                    </Link>
                </div>
            </div>
            <FontAwesomeIcon className={styles.menuIcon} icon={faBars} onClick={openNavMenu}/>
            <Link to='/'><span className={styles.logo}>LearnMode</span></Link>
            <div className={styles.emptyspace}></div>
            <i className="fa-solid fa-bars"></i>
            <div className={styles.profilePictureContainer}>
                {localStorage.getItem("auth") &&
                    <img src={`${BASE_URL}/users/profile/picture/${decode(localStorage.getItem("auth")).uid}`}/>
                }
            </div>
            <div className={styles.user} onClick={openUserMenu}>{user} <FontAwesomeIcon icon={faCaretDown}/></div>
            {userMenuOpen &&
                <div className={styles.userMenuContainer}>
                    <div className={styles.userMenu} onClick={() => {nav("/profile")}}>Profile</div>
                    <div className={styles.userMenu} onClick={logout}>Logout</div>
                </div>
            }
        </nav>
    )
}

export default Navbar;