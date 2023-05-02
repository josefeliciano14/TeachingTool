import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";
import styles from './../Styles/Login.module.scss';

function Register(){
    const [formData, setFormData] = useState({first_name: '', last_name: '', email: '', password: ''});
    const [errorMessage, setErrorMessage] = useState("no message");
    const [img, setImg] = useState();
    const [imgFile, setImgFile] = useState();

    const nav = useNavigate();

    function submit(e){
        e.preventDefault();

        const payload = new FormData();

        if(imgFile){
            payload.append('img', imgFile);
        }

        payload.append("first_name", formData.first_name);
        payload.append("last_name", formData.last_name);
        payload.append("email", formData.email);
        payload.append("password", formData.password);

        register(payload)
            .then((res) => {
                console.log(res);
                
                if(res?.data?.token){
                    localStorage.setItem("auth", res.data.token);

                    nav("/");

                    return;
                }
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
            });
    }

    function handleChange(e){
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    function imgChange(e){
        if(e?.target?.files[0]){
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = function() {
                setImgFile(file);
                setImg(reader.result);
            }
        }
    }
    
    return(
        <main>
            <form className={styles.loginRegisterForm}>
                <div className={styles.header}>
                    <h1>Register</h1>
                </div>
                <div className={styles.content}>
                    <input type='text' name='first_name' placeholder='First Name' onChange={handleChange}/>
                    <input type="text" name='last_name' placeholder='Last Name' onChange={handleChange}/>
                    <input type='text' name='email' placeholder='Email' onChange={handleChange}/>
                    <input type="password" name='password' placeholder='Password' onChange={handleChange}/>
                    <div className={styles.imageContainer}>
                        <span>Profile Picture:</span>
                        <input type="file" onChange={imgChange}/>
                        <div className={styles.imagePreviewContainer}>
                            <div className={styles.imagePreview}>
                                <img src={img}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={submit}>Register</button>
                        <Link to="/login">Already have an account? Login here</Link>
                        <span style={{visibility:(errorMessage!="no message" ? "visible" : "hidden")}} className={styles.errorMessage}>{errorMessage}</span>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Register;