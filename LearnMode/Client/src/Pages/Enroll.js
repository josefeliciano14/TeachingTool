import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import styles from '../Styles/CreateSection.module.scss';
import { useEffect, useState } from "react";
import { enrollInSection } from "../api";

function Enroll(){
    const {sid, code} = useParams();

    const [error, setError] = useState();

    const nav = useNavigate();

    useEffect(() => {
        enrollInSection(sid, code)
            .then(() => {
                nav("/?show=enrolled");
            })
            .catch((err) => {
                if(err.response.status === 400){
                    setError(err.response.data.message);
                }
            });
    });
    
    return(
        <main>
            <Navbar/>
            <div className={styles.textContainer}>
                <h1>{error || "Enrolling..."}</h1>
            </div>

            {error &&
                <button onClick={() => {nav("/")}}>Home</button>
            }
        </main>
    )
}

export default Enroll;