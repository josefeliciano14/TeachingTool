import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import styles from '../Styles/Section.module.scss';
import { getSection, removeStudent } from "../api";
import { useParams } from "react-router-dom";

import { PieChart, Pie, Cell, Bar, BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClipboard, faX } from '@fortawesome/free-solid-svg-icons'

function Section(){
    
    const {sid} = useParams();

    const [code, setCode] = useState("");
    const [students, setStudents] = useState([]);
    const [statistics, setStatistics] = useState({avg: "", stddev: "", min: "", max: ""});
    const [pieValues, setPieValues] = useState([]);
    const [barValues, setBarValues] = useState([]);
    const [linkClicked, setLinkClicked] = useState(false);
    
    const COLORS = ['#337137', '#1DC09A'];

    useEffect(() => {
        getSection(sid)
            .then((res) => {
                setCode(res?.data?.code);
                
                setStudents(res.data.students);
                if(res.data.statistics){

                    setStatistics(res.data.statistics[0]);

                    setPieValues(
                        [
                            {   
                                name: "Completed",
                                value: res.data.statistics[0].completed
                            }, 
                            {   
                                name: "Not Completed",
                                value: res.data.students.length-res.data.statistics[0].completed
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
            });
    }, []);

    function remove(uid, sid){
        removeStudent(uid, sid);

        setStudents(students.filter((student) => student.uid != uid));
    }
    
    return(
        <main>
            <Navbar/>

            {students.length > 0 ? 
            
                <>
                    <h1 className={styles.title}>{`${students[0].module_name} - Section: ${students[0].section_name}`}</h1>

                    {code && 
                        <div className={styles.linkContainer} onClick={() => {setLinkClicked(true); navigator.clipboard.writeText(`${window.location.host}/enroll/${sid}/${code}`)}}>
                            <span className={styles.linkText}>Enrollment Link: </span>
                            <div className={styles.link}>
                                <span>{`${window.location.host}/enroll/${sid}/${code}`}</span>
                            </div>
                            <FontAwesomeIcon icon={linkClicked ? faCheck : faClipboard}/>
                        </div>
                    }

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
                                    <span className={styles.value}>{statistics.avg != null ? statistics.avg : "N/A"}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Std Dev</span>
                                    <span className={styles.value}>{statistics.stddev != null ? statistics.stddev : "N/A"}</span>
                                </div>
                            </div>
                            <div className={styles.statRow}>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Maximum</span>
                                    <span className={styles.value}>{statistics.max != null ? statistics.max : "N/A"}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Minimum</span>
                                    <span className={styles.value}>{statistics.min != null ? statistics.min : "N/A"}</span>
                                </div>
                            </div>
                            <div className={styles.statRow}>
                                <div className={styles.longStat}>
                                    <span className={styles.label}>Average Diagnostic Improvement</span>
                                    <span className={styles.value}>{students[0]?.average_improvement != null ? `${students[0].average_improvement}%` : "N/A"}</span>
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
                            </tbody>
                        </table>
                    </div>
                </>

            :
                <h1>Loading...</h1>
            }
        </main>
    )
}

export default Section;