import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import styles from '../Styles/CreateSection.module.scss';
import { getMyModules } from "../api";
import { useNavigate } from "react-router-dom";
import { createSection } from "../api";

function CreateSection(){
    
    const [modules, setModules] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [module, setModule] = useState("");

    const nav = useNavigate();
    
    useEffect(() => {
        getMyModules()
            .then((res) => {
                setModules(res.data);

                if(res.data.length > 0){
                    setModule(res.data[0].mid);
                }

                setLoaded(true);
            });
    }, []);

    function submit(){
        createSection({
            name: name,
            code: code, 
            module: module
        });

        nav("/sections");
    }
    
    return(
        <main>
            <Navbar/>

            <div className={styles.window}>
                <div className={styles.header}>
                    Create Section
                </div>
                <div className={styles.content}>
                    {(modules.length > 0 && loaded)?
                        <>
                            <div className={styles.input}>
                                <label>Section Name:</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>

                            <div className={styles.input}>
                                <label>Code (Optional):</label>
                                <input type="text" value={code} onChange={(e) => setCode(e.target.value)}/>
                            </div>

                            <div className={styles.input}>
                                <label>Module:</label>
                                <select value={module} onChange={(e) => setModule(e.target.value)}>
                                    {modules.map((module, index) => {
                                        return <option key={index} value={module.mid}>{module.name}</option>
                                    })}
                                </select>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button className={styles.button} onClick={submit}>Submit</button>
                            </div>
                        </>
                    :
                        <div className={styles.error}>
                            <p>You need to create a Module before you can create a Section</p>

                            <button className={styles.button} onClick={() => nav("/create-module")}>Create Module</button>
                        </div>
                    }
                </div>
            </div>
        </main>
    )
}

export default CreateSection;