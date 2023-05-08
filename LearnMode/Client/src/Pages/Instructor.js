import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { getInstructor, updatePermissions, removeInstructor, BASE_URL } from "../api";
import styles from '../Styles/Instructor.module.scss';

function Instructor(){
    
    const {iid, sid} = useParams();
    
    const [instructor, setInstructor] = useState({});
    const [viewGrades, setViewGrades] = useState(false);
    const [removeStudents, setRemoveStudents] = useState(false);
    const [editModule, setEditModule] = useState(false);
    const [buttonText, setButtonText] = useState("Save");

    const nav = useNavigate();

    useEffect(() => {
        getInstructor(iid, sid)
            .then((res) => {
                console.log(res.data);

                setInstructor(res.data);

                setViewGrades(res.data.permission_viewGrades === 1);
                setRemoveStudents(res.data.permission_removeStudents === 1);
                setEditModule(res.data.permission_editModule === 1);
            });
    }, []);

    function remove(){
        removeInstructor(iid, sid);
        
        nav("/instructors");
    }

    async function saveChanges(){
        updatePermissions(iid, sid, {
            permission_viewGrades: viewGrades,
            permission_removeStudents: removeStudents, 
            permission_editModule: editModule
        });

        setButtonText("Saved");

        await new Promise(resolve => setTimeout(resolve, 1000));

        setButtonText("Save");
    }
    
    return(
        <main>
            <Navbar/>
            {instructor.iid ?
                    <>
                        <h1 className={styles.title}>{`Instructor: ${instructor.first_name} ${instructor.last_name}`}</h1>    

                        <div className={styles.container}>
                            <div className={styles.instructor}>
                                <div className={styles.imgContainer}>
                                    <img src={`${BASE_URL}/users/profile/picture/${instructor.uid}`}/>
                                </div>
                                <span className={styles.name}>{`${instructor.first_name} ${instructor.last_name}`}</span>
                                <span className={styles.university}>{`${instructor.university || ""} - ${instructor.department || ""}`}</span>
                            </div>

                            <div className={styles.sections}>
                                <div className={styles.row}>
                                    <div className={styles.label}>Role</div>
                                    <div className={styles.value} style={{fontWeight: "bold"}}>{"Instructor"}</div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.label}>Section</div>
                                    <div className={styles.value} style={{fontWeight: "bold"}}>{instructor.section_name || "-"}</div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.label}>Module</div>
                                    <div className={styles.value} style={{fontWeight: "bold"}}>{instructor.module_name || "-"}</div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.label}>Permissions</div>
                                    <div className={styles.value}>
                                        <div className={styles.permission}>
                                            <input type="checkbox" id="permission1" name="permission1" value="viewGrades" checked={viewGrades} onChange={() => {setViewGrades(!viewGrades)}}/>
                                            <label htmlFor="permission1"> View Grades</label>
                                        </div>
                                        <div className={styles.permission}>
                                            <input type="checkbox" id="permission2" name="permission2" value="removeStudents" checked={removeStudents} onChange={() => {setRemoveStudents(!removeStudents)}}/>
                                            <label htmlFor="permission2"> Remove Students</label>
                                        </div>
                                        <div className={styles.permission}>
                                            <input type="checkbox" id="permission3" name="permission3" value="editModule" checked={editModule} onChange={() => {setEditModule(!editModule)}}/>
                                            <label htmlFor="permission3"> Edit Module</label>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.label}>Remove</div>
                                    <div className={styles.value}>
                                        <button onClick={remove}>X</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={saveChanges}>{buttonText}</button>
                    </>
                :
                    <h1 className={styles.title}>Loading...</h1>
            }
        </main>
    )
}

export default Instructor;