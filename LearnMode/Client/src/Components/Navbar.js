import {useState,useEffect} from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

import decode from 'jwt-decode';

import './Navbar.css';

function Navbar(){

    const [user, setUser] = useState("");

    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const nav = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem('auth');
        
        if(token){
            setUser(decode(token).username);
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

    function openUserMenu(){
        setUserMenuOpen(!userMenuOpen);
    }

    return(
        <nav>
            <Link to='/'><span className='logo'>LearnMode</span></Link>
            <div className='emptyspace'></div>
            <i className="fa-solid fa-bars"></i>
            { user
                ? <div className='user' onClick={openUserMenu}>{user} <FontAwesomeIcon icon={faCaretDown}/></div>
                : <Link to='/login'>Login</Link> 
            }
            {userMenuOpen &&
                <div className='user-menu-container'>
                    <div className='user-menu' onClick={logout}>Logout</div>
                </div>
            }
        </nav>
    )
}

export default Navbar;