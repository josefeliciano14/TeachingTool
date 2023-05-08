import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import styles from '../Styles/Section.module.scss';
import { getSection, removeStudent } from "../api";
import { useNavigate, useParams } from "react-router-dom";

import { PieChart, Pie, Cell, Bar, BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClipboard, faX } from '@fortawesome/free-solid-svg-icons'

function Section(){
    
    const {sid} = useParams();

    const [section, setSection] = useState(null);
    const [students, setStudents] = useState([]);
    const [notCompleted, setNotCompleted] = useState([]);
    const [statistics, setStatistics] = useState({avg: "", stddev: "", min: "", max: ""});
    const [pieValues, setPieValues] = useState([]);
    const [barValues, setBarValues] = useState([]);
    const [linkClicked, setLinkClicked] = useState(false);
    
    const COLORS = ['#337137', '#1DC09A'];

    const nav = useNavigate();

    useEffect(() => {
        getSection(sid)
            .then((res) => {
                console.log(res.data);
                
                setSection(res?.data?.section);
                
                setStudents(res.data.students);
                setNotCompleted(res.data.not_completed);
                if(res.data.statistics){

                    setStatistics(res.data.statistics);

                    setPieValues(
                        [
                            {   
                                name: "Completed",
                                value: res.data.statistics.completed
                            }, 
                            {   
                                name: "Not Completed",
                                value: res.data.not_completed.length
                            }, 
                        ]
                    );

                    setBarValues(
                        [
                            {
                                name: 'A',
                                Quantity: res.data.students.filter((student) => student.evaluation_score >= 90).length
                            },
                            {
                                name: 'B',
                                Quantity: res.data.students.filter((student) => student.evaluation_score >= 80 && student.evaluation_score < 90).length
                            },
                            {
                                name: 'C',
                                Quantity: res.data.students.filter((student) => student.evaluation_score >= 70 && student.evaluation_score < 80).length
                            },
                            {
                                name: 'D',
                                Quantity: res.data.students.filter((student) => student.evaluation_score >= 60 && student.evaluation_score < 70).length
                            },
                            {
                                name: 'F',
                                Quantity: res.data.students.filter((student) => student.evaluation_score < 60 && student.evaluation_score).length
                            },
                        ]
                    );
                }

                console.log(res.data);
            })
            .catch((err) => {
                nav("/");
            });
    }, []);

    function remove(uid, sid){
        removeStudent(uid, sid);

        setStudents(students.filter((student) => student.uid != uid));
    }
    
    return(
        <main>
            <Navbar/>

            {section?.code 
                ? 
                    <>
                        <h1 className={styles.title}>{`${section.module_name} - Section: ${section.section_name}`}</h1>

                        {section.code && 
                            <div className={styles.linkContainer} onClick={() => {setLinkClicked(true); navigator.clipboard.writeText(`${window.location.host}/enroll/${sid}/${section.code}`)}}>
                                <span className={styles.linkText}>Enrollment Link: </span>
                                <div className={styles.link}>
                                    <span>{`${window.location.host}/enroll/${sid}/${section.code}`}</span>
                                </div>
                                <FontAwesomeIcon icon={linkClicked ? faCheck : faClipboard}/>
                            </div>
                        }
                    </>
                :
                    <h1>Loading...</h1>
            }

            {students.length > 0 ? 
            
                <>
                    <div className={styles.charts}>
                        <div className={styles.chartContainer}>
                            <span className={styles.chartTitle}>Completion</span>
                            
                            {pieValues.length > 0 && 
                                <PieChart width={300} height={300}>
                                    <Pie
                                        data={pieValues}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={125}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieValues.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            }
                        </div>

                        <div className={styles.chartContainer}>
                            <span className={styles.chartTitle}>Grades</span>
                            <BarChart
                                width={500}
                                height={300}
                                data={barValues}
                                barSize={50}
                                >
                                <XAxis dataKey="name" scale="point" padding={{ left: 50, right: 50 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="Quantity" fill="var(--main-color)" background={{ fill: '#eee' }} />
                            </BarChart>
                        </div>

                        <div className={styles.statsContainer} style={{width:"20%"}}>
                            <div className={styles.statRow}>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Average</span>
                                    <span className={styles.value}>{statistics.avg != null ? Math.floor(statistics.avg*100)/100 : "N/A"}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Std Dev</span>
                                    <span className={styles.value}>{statistics.stddev != null ? Math.floor(statistics.stddev*100)/100 : "N/A"}</span>
                                </div>
                            </div>
                            <div className={styles.statRow}>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Maximum</span>
                                    <span className={styles.value}>{statistics.max != null ? Math.floor(statistics.max*100)/100 : "N/A"}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Minimum</span>
                                    <span className={styles.value}>{statistics.min != null ? Math.floor(statistics.min*100)/100 : "N/A"}</span>
                                </div>
                            </div>
                            <div className={styles.statRow}>
                                <div className={styles.longStat}>
                                    <span className={styles.label}>Average Diagnostic Improvement</span>
                                    <span className={styles.value}>{statistics.average_improvement != null ? `${Math.floor(statistics.average_improvement*100)/100}%` : "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Completion</th>
                                    <th>Diagnostic</th>
                                    <th>Score</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => {
                                    if(student.uid){
                                        return(
                                            <tr key={index}>
                                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                                <td>{student?.date_taken?.split("T")[0] || "-"}</td>
                                                <td>{student.diagnostic_score != null ? `${student.diagnostic_score}%` : "-"}</td>
                                                <td>{student.evaluation_score != null ? `${student.evaluation_score}%` : "-"}</td>
                                                <td className={styles.remove} onClick={() => remove(student.uid, sid)}><FontAwesomeIcon icon={faX}/></td>
                                            </tr>
                                        )
                                    }
                                })}

                                {notCompleted.map((student, index) => {
                                    if(student.uid){
                                        return(
                                            <tr key={index}>
                                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td className={styles.remove} onClick={() => remove(student.uid, sid)}><FontAwesomeIcon icon={faX}/></td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            
                :
                    <h3 className={styles.message}>There are currently no students in this section</h3>
            }
        </main>
    )
}

export default Section;