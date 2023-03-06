import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import './Login.css';

function Login(){
    const [formData, setFormData] = useState({email: '', password: ''});

    const [errorMessage, setErrorMessage] = useState("");

    const nav = useNavigate();

    function login(e){
        e.preventDefault();

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }

        fetch("http://localhost:5000/users/signin", requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data?.token){
                    localStorage.setItem("auth", data.token);

                    nav("/");

                    return;
                }

                if(data?.message){
                    setErrorMessage(data?.message);
                }
            });
    }

    function handleChange(e){
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    
    return(
        <main>
            <h1>Login</h1>

            <form className="login-register-form">
                <input type='text' name='email' placeholder='Email' onChange={handleChange}/>
                <input type="password" name='password' placeholder='Password' onChange={handleChange}/>
                <button onClick={login}>Login</button>
                <span className="error-message">{errorMessage}</span>
            </form>

            <Link to="/register">Don't have an account? Register Here</Link>
        </main>
    )
}

export default Login;