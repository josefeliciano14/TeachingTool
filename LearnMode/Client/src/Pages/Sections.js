import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.js'
import styles from '../Styles/Sections.module.scss';
import {BASE_URL} from '../api/index.js';
import { useEffect, useState } from 'react';
import { getSections } from '../api/index.js';
import { Link } from 'react-router-dom';

function Sections(){
    const nav = useNavigate();

    const [modules, setModules] = useState({created: [], instructing: [], enrolled: []});
    const [role, setRole] = useState("");
    const [showing, setShowing] = useState();

    async function arrangeSections(modules){
        let list = [];
        let currentModule = modules[0].mid;
        let currentSections = [];

        await new Promise((resolve, reject) => {
            modules.map((section) => {
                if(section.mid === currentModule){
                    currentSections.push(section);
                }
                else{
                    list.push({module: currentSections[0].module_name, mid: currentSections[0].mid, image: currentSections[0].image, sections: currentSections});
                    currentModule = section.mid;
                    currentSections = [section];
                }
            });

            resolve();
        });

        list.push({module: currentSections[0].module_name, mid: currentSections[0].mid, image: currentSections[0].image, sections: currentSections});

        return list;
    }

    useEffect(() => {
        getSections()
        .then(async (res) => {

            setRole(res?.data?.role);

            let createdList = [];
            let instructingList = [];
            let enrolledList = [];

            await new Promise((resolve, reject) => {
                if(res?.data?.created?.length > 0){
                    arrangeSections(res.data.created).then((list) => {
                        createdList = list;
                    })
                }
                
                if(res?.data?.instructing?.length > 0){
                    arrangeSections(res.data.instructing).then((list) => {
                        instructingList = list;
                    });
                }
                
                if(res?.data?.enrolled?.length > 0){
                    arrangeSections(res.data.enrolled).then((list) => {
                        enrolledList = list;
                    });
                }
                
                resolve();
            }).then(() => {
                
            });

            setModules({
                created: createdList,
                instructing: instructingList,
                enrolled: enrolledList
            });

            if(createdList.length > 0){
                setShowing("created");
            }
            else if(instructingList.length > 0){
                setShowing("instructing");
            }
            else{
                setShowing("enrolled");
            }
        });
    }, []);
    
    return(
        <main>
            <Navbar/>

            <h1 className={styles.title}>Sections</h1>

            {role === "professor" &&
                <button className={styles.button} onClick={() => {nav("/create-section")}}>+ Create Section</button>
            }

            {(modules?.created?.length > 0 || modules?.instructing?.length > 0) &&
                <div className={styles.selector}>
                    {role === "professor" &&
                        <div className={showing === "created" ? styles.selected : styles.option} onClick={() => setShowing("created")}>Created</div>
                    }
                    {modules.instructing?.length > 0 &&
                        <div className={showing === "instructing" ? styles.selected : styles.option} onClick={() => setShowing("instructing")}>Instructing</div>
                    }
                    <div className={showing === "enrolled" ? styles.selected : styles.option} onClick={() => setShowing("enrolled")}>Enrolled</div>
                </div>
            }

            {modules[showing]?.length > 0 && modules[showing].map((module, index) => {
                return(
                    <div key={index} className={styles.window}>
                        <div className={styles.header}>
                            {module.module}
                        </div>

                        <div className={styles.content}>
                            <div className={styles.imgContainer}>
                                {module.image &&
                                    <img src={`${BASE_URL}/modules/image/${module.mid}`}/>
                                }
                            </div>
                            <div className={styles.sectionList}>
                                {module.sections.map((section, index) => {
                                    return(
                                        <Link key={index} to={showing === "enrolled" ? `/module/${section.mid}/section/${section.sid}` : `/section/${section.sid}`}>
                                            <div className={styles.section}>
                                                <span>{section.section_name}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </main>
    )
}

export default Sections;