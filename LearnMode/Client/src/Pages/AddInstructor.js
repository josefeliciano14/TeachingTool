import { useNavigate } from "react-router";
import Navbar from "../Components/Navbar";
import styles from '../Styles/CreateSection.module.scss';
import { useEffect, useState } from "react";
import { getSections, addInstructor } from "../api";

function AddInstructor(){
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState("");
    const [section, setSection] = useState("");
    const [sections, setSections] = useState([]);
    const [module, setModule] = useState("");
    const [modules, setModules] = useState([]);
    const [currentSections, setCurrentSections] = useState([]);
    const [viewGrades, setViewGrades] = useState(false);
    const [removeStudents, setRemoveStudents] = useState(false);
    const [editModule, setEditModule] = useState(false);

    const nav = useNavigate();

    useEffect(() => {
        getSections()
            .then((res) => {

                console.log(res.data.created);
                setSections(res.data.created);
                setLoaded(true);

                if(res.data.created.length > 0){
                    let list = [];
                    let mids = [];
                    
                    res.data.created.map((s) => {
                        if(!mids.includes(s.mid)){
                            list.push({mid: s.mid, name: s.module_name});
                            mids.push(s.mid);
                        }
                    });

                    setModules(list);
                    
                    setModule(res.data.created[0].mid);
                }
            })
    }, []);

    useEffect(() => {
        if(module){
            let list = [];
            
            sections.map((s) => {
                if(Number(s.mid) === Number(module)){
                    list.push(s);
                }
            });

            setCurrentSections(list);
            
            setSection(list[0].sid || "");
        }
    }, [module]);

    function submit(){
        addInstructor({
            user: user.trim(),
            section: section,
            permission_viewGrades: viewGrades,
            permission_removeStudents: removeStudents, 
            permission_editModule: editModule
        })
        .then(() => {
            nav("/instructors");
        });
    }
    
    return(
        <main>
            <Navbar/>

            <div className={styles.window}>
                <div className={styles.header}>
                    Add Instructor
                </div>
                <div className={styles.content}>
                    {(sections.length > 0 && loaded)?
                        <>
                            <div className={styles.input}>
                                <label>Email Address:</label>
                                <input type="text" value={user} onChange={(e) => setUser(e.target.value)}/>
                            </div>

                            <div className={styles.input}>
                                <label>Module:</label>
                                <select value={module} onChange={(e) => setModule(e.target.value)}>
                                    {modules.map((module, index) => {
                                        return <option key={index} value={module.mid}>{module.name}</option>
                                    })}
                                </select>
                            </div>

                            <div className={styles.input}>
                                <label>Section:</label>
                                <select value={section} onChange={(e) => setSection(e.target.value)}>
                                    {currentSections.map((section, index) => {
                                        return <option key={index} value={section.sid}>{section.section_name}</option>
                                    })}
                                </select>
                            </div>

                            <span>Permissions:</span>
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

                            <div className={styles.buttonContainer}>
                                <button className={styles.button} onClick={submit}>Submit</button>
                            </div>
                        </>
                    :
                        <div className={styles.error}>
                            <p>You need to create a Section before you can add an instructor</p>

                            <button className={styles.button} onClick={() => nav("/create-section")}>Create Section</button>
                        </div>
                    }
                </div>
            </div>
        </main>
    )
}

export default AddInstructor;