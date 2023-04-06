import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.js'
import styles from '../Styles/Sections.module.scss';
import {BASE_URL} from '../api/index.js';
import { useEffect, useState } from 'react';
import { getSections } from '../api/index.js';
import { Link } from 'react-router-dom';

function Sections(){
    const nav = useNavigate();

    const [modules, setModules] = useState([]);

    useEffect(() => {
        let list = [];
        let currentModule;
        let currentSections;
        
        getSections()
        .then(async (res) => {
            
            if(res?.data?.length > 0){
                currentModule = res.data[0].mid;
                currentSections = [];
            
                await new Promise((resolve, reject) => {
                    res.data.map((section) => {
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
                setModules(list);
            }
        });
    }, []);
    
    return(
        <main>
            <Navbar/>

            <h1>Sections</h1>

            <button className={styles.button} onClick={() => {nav("/create-section")}}>+ Create Section</button>

            {modules.map((module, index) => {
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
                                        <Link key={index} to={`/section/${section.sid}`}>
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