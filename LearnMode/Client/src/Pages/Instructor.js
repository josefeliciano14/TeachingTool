import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { getInstructor, updatePermissions, removeInstructor } from "../api";
import styles from '../Styles/Instructor.module.scss';

function Instructor(){
    
    const {iid, sid} = useParams();
    
    const [instructor, setInstructor] = useState({});
    const [viewGrades, setViewGrades] = useState(false);
    const [removeStudents, setRemoveStudents] = useState(false);
    const [editModule, setEditModule] = useState(false);

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

    function saveChanges(){
        updatePermissions(iid, sid, {
            permission_viewGrades: viewGrades,
            permission_removeStudents: removeStudents, 
            permission_editModule: editModule
        });
    }
    
    return(
        <main>
            <Navbar/>
            {instructor.iid ?
                    <>
                        <h1>{`Instructor: ${instructor.first_name} ${instructor.last_name}`}</h1>    

                        <div className={styles.container}>
                            <div className={styles.row}>
                                <div className={styles.label}>Full Name</div>
                                <div className={styles.value}>{`${instructor.first_name} ${instructor.last_name}`}</div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.label}>University</div>
                                <div className={styles.value}>{instructor.university || "-"}</div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.label}>Department</div>
                                <div className={styles.value}>{instructor.department || "-"}</div>
                            </div>
                        </div>

                        <h3>{`Section: ${instructor.section_name}`}</h3>

                        <div className={styles.container}>
                            <div className={styles.row}>
                                <div className={styles.label}>Section</div>
                                <div className={styles.value}>{instructor.section_name || "-"}</div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.label}>Module</div>
                                <div className={styles.value}>{instructor.module_name || "-"}</div>
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

                        <button onClick={saveChanges}>Save</button>
                    </>
                :
                    <h1>Loading...</h1>
            }
        </main>
    )
}

export default Instructor;