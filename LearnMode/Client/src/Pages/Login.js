import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from './../Styles/Login.module.scss';

function Login(){
    const [formData, setFormData] = useState({email: '', password: ''});

    const [errorMessage, setErrorMessage] = useState("no message");

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
            <form className={styles.loginRegisterForm}>
                <div className={styles.header}>
                    <h1>Login</h1>
                </div>
                <div className={styles.content}>
                    <input type='text' name='email' placeholder='Email' onChange={handleChange}/>
                    <input type="password" name='password' placeholder='Password' onChange={handleChange}/>
                    <div className={styles.buttonContainer}>
                        <button onClick={login}>Login</button>
                        <Link className={styles.link} to="/register">Don't have an account? Register Here</Link>
                        <span style={{visibility:(errorMessage!="no message" ? "visible" : "hidden")}} className={styles.errorMessage}>{errorMessage}</span>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Login;