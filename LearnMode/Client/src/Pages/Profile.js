import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import styles from '../Styles/CreateSection.module.scss';
import { BASE_URL, getProfile, updateProfile } from "../api";
import decode from 'jwt-decode';

function Profile(){
    
    const [data, setData] = useState({});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [img, setImg] = useState();
    const [imgFile, setImgFile] = useState();

    const [iUniversity, setIUniversity] = useState("");
    const [iDepartment, setIDepartment] = useState("");

    const [pUniversity, setPUniversity] = useState("");
    const [pDepartment, setPDepartment] = useState("");

    const [uButton, setUButton] = useState("Save");
    const [iButton, setIButton] = useState("Save");
    const [pButton, setPButton] = useState("Save");
    
    useEffect(() => {
        getProfile()
            .then((res) => {
                const data = res.data;
                
                setData(data);

                setFirstName(data.user.first_name || "");
                setLastName(data.user.last_name || "");

                setIUniversity(data.instructor.university || "");
                setIDepartment(data.instructor.department || "");

                setPUniversity(data.professor.university || "");
                setPDepartment(data.professor.department || "");
            });
    }, []);

    async function update(profile){
        if(profile === "user"){
            const formData = new FormData();
            
            if(imgFile){
                formData.append('img', imgFile);
            }

            formData.append("profile", "user");
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            
            updateProfile(formData);

            setUButton("Saved");

            await new Promise(resolve => setTimeout(resolve, 1000));

            setUButton("Save");
        }
        else if(profile === "instructor"){
            updateProfile({
                profile: "instructor",
                university: iUniversity,
                department: iDepartment
            });

            setIButton("Saved");

            await new Promise(resolve => setTimeout(resolve, 1000));

            setIButton("Save");
        }
        else if(profile === "professor"){
            updateProfile({
                profile: "professor",
                university: pUniversity,
                department: pDepartment
            });

            setPButton("Saved");

            await new Promise(resolve => setTimeout(resolve, 1000));

            setPButton("Save");
        }
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
            <Navbar/>
            {data?.user && 
                <>
                    <div className={styles.window}>
                        <div className={styles.header}>
                            User: {firstName} {lastName}
                        </div>
                        <div className={styles.profileForm}>
                            
                            <label>First Name:</label>
                            <input type="text" value={firstName} onChange={(e) => {setFirstName(e.target.value)}}/>
                            <label>Last Name:</label>
                            <input type="text" value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>
                            <label>Email:</label>
                            <input type="text" disabled={true} value={data.user.email}/>
                            <label>Picture:</label>
                            <div className={styles.imgForm}>
                                <div className={styles.imgContainer}>
                                    {img 
                                        ?
                                            <img src={img}/>
                                        :
                                            <img src={`${BASE_URL}/users/profile/picture/${decode(localStorage.getItem("auth")).uid}`}/>
                                    }
                                </div>
                                <input type="file" onChange={imgChange}/>
                            </div>
                            
                            <div className={styles.buttonContainer} style={{marginTop: "20px"}}>
                                <button onClick={() => {update("user")}}>{uButton}</button>
                            </div>
                        </div>
                    </div>

                    {data?.instructor &&
                        <div className={styles.window}>
                            <div className={styles.header}>
                                Instructor: {firstName} {lastName}
                            </div>
                            <div className={styles.profileForm}>
                                
                                <label>University:</label>
                                <input type="text" value={iUniversity} onChange={(e) => {setIUniversity(e.target.value)}}/>
                                <label>Department:</label>
                                <input type="text" value={iDepartment} onChange={(e) => {setIDepartment(e.target.value)}}/>
                                
                                <div className={styles.buttonContainer} style={{marginTop: "20px"}}>
                                    <button onClick={() => {update("instructor")}}>{iButton}</button>
                                </div>
                            </div>
                        </div>
                    }

                    {data?.professor &&
                        <div className={styles.window}>
                            <div className={styles.header}>
                                Professor: {firstName} {lastName}
                            </div>
                            <div className={styles.profileForm}>
                                
                                <label>University:</label>
                                <input type="text" value={pUniversity} onChange={(e) => {setPUniversity(e.target.value)}}/>
                                <label>Department:</label>
                                <input type="text" value={pDepartment} onChange={(e) => {setPDepartment(e.target.value)}}/>
                                
                                <div className={styles.buttonContainer} style={{marginTop: "20px"}}>
                                    <button onClick={() => {update("professor")}}>{pButton}</button>
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </main>
    )
}

export default Profile;