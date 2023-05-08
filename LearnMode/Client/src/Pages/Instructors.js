import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.js'
import styles from '../Styles/Sections.module.scss';
import {BASE_URL, getInstructors} from '../api/index.js';
import { useEffect, useState } from 'react';
import { getSections } from '../api/index.js';
import { Link } from 'react-router-dom';

function Instructors(){
    const nav = useNavigate();

    const [sections, setSections] = useState([]);

    useEffect(() => {
        let list = [];
        let currentSection;
        let currentInstructors;
        
        getInstructors()
            .then(async (res) => {
                if(res?.data?.length > 0){
                    currentSection = res.data[0].sid;
                    currentInstructors = [];

                    await new Promise((resolve, reject) => {
                        res.data.map((instructor) => {
                            if(instructor.sid === currentSection){
                                currentInstructors.push(instructor);
                            }
                            else{
                                list.push({module: currentInstructors[0].module_name, mid: currentInstructors[0].mid, section: currentInstructors[0].section_name, instructors: currentInstructors, image: currentInstructors[0].image});
                                currentSection = instructor.sid;
                                currentInstructors = [instructor];
                            }
                        });
                        
                        resolve();
                    });

                    list.push({module: currentInstructors[0].module_name, mid: currentInstructors[0].mid, section: currentInstructors[0].section_name, instructors: currentInstructors, image: currentInstructors[0].image});
                    console.log(list);
                    setSections(list);
                }
            });
    }, []);
    
    return(
        <main>
            <Navbar/>

            <h1 className={styles.title}>Instructors</h1>

            <button className={styles.button} onClick={() => {nav("/add-instructor")}}>+ Add Instructor</button>

            {sections?.length === 0 &&
                <h4 className={styles.message}>You currently do not have any instructors</h4>
            }

            {sections.map((section, index) => {
                return(
                    <div key={index} className={styles.window}>
                        <div className={styles.header}>
                            {`${section.module} - ${section.section}`}
                        </div>

                        <div className={styles.content}>
                            <div className={styles.imgContainer}>
                                {section.image ?
                                    <img src={`${BASE_URL}/modules/image/${section.mid}`}/>
                                    : <h1>Nothing</h1>
                                }
                            </div>
                            <div className={styles.sectionList}>
                                {section.instructors.map((instructor, index) => {
                                    return(
                                        <Link key={index} to={`/instructor/${instructor.iid}/${instructor.sid}`}>
                                            <div className={styles.section}>
                                                <span>{`${instructor.first_name} ${instructor.last_name}`}</span>
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

export default Instructors;