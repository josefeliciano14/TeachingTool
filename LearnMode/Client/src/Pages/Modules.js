import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../Components/Navbar";
import ModulePreview from "../Components/ModulePreview";
import { Link, useNavigate } from "react-router-dom";

import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from '../Styles/Modules.module.scss';
import styles2 from '../Styles/ModulePreview.module.scss';
import { useEffect, useState } from "react";

import {getEnrolledModules, getHomeModules, getInstructingModules, getMyModules, getMyModulesLimit, searchModules} from '../api/index.js'

import { deleteModule } from "../api/index.js";

function Modules(){
    
    const nav = useNavigate();

    const [created, setCreated] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [instructing, setInstructing] = useState([]);
    const [searched, setSearched] = useState([]);
    const [query, setQuery] = useState("");
    const [showing, setShowing] = useState("searched");
    const [modalOpen, setModalOpen] = useState(false);
    const [current, setCurrent] = useState({});
    const [searchedOnce, setSearchedOnce] = useState(false);
    const [attemptingDelete, setAttemptingDelete] = useState(false);


    function setupModules(){
        getHomeModules()
            .then((res) => {
                setCreated(compileModules(res?.data?.created, "created"));
                setEnrolled(compileModules(res?.data?.enrolled, "enrolled"));
                setInstructing(compileModules(res?.data?.instructing, "instructing"));

                if(res?.data?.created?.length > 0){
                    setShowing("created");
                }
                else if(res?.data?.enrolled?.length > 0){
                    setShowing("enrolled");
                }
                else if(res?.data?.instructing?.length > 0){
                    setShowing("instructing");
                }
            });
    }

    useEffect(() => {
        setupModules();
    }, []);

    function compileModules(data, type){
        let list = [];
        if(data?.map){
            data.map((m, index) => {
                list.push(<ModulePreview key={index} mid={m.mid} module={m} onClick={() => openModule(m, type)}/>)
            });
        }

        return list;
    }

    function viewAllModules(){
        if(showing === "created"){
            getMyModules().then((res) => {
                setCreated(compileModules(res?.data, "created"));
            });
        }
        else if(showing === "enrolled"){
            getEnrolledModules().then((res) => {
                setEnrolled(compileModules(res?.data, "enrolled"));
            });
        }
        else if(showing === "instructing"){
            getInstructingModules().then((res) => {
                setInstructing(compileModules(res?.data, "instructing"));
            });
        }
    }

    function search(){
        setSearchedOnce(true);
        
        searchModules(query)
            .then((res) => {
                setSearched(compileModules(res?.data, "searched"));
            });
    }

    function openModule(m, type){
        setModalOpen(true);
        m.type = type;
        setCurrent(m);
    }

    function closeModal(e){
        if(e.target.id === "outside"){
            setModalOpen(false);
        }
    }

    useEffect(() => {
        setAttemptingDelete(false);
    }, [modalOpen]);

    function confirmDelete(){
        setModalOpen(false);

        setCreated((prev) => {
            return prev.filter((prev) => {
                return prev.props.mid != current.mid;
            });
        });

        deleteModule(current.mid);
    }
    
    return(
        <>
            <main style={{opacity: modalOpen ? 0.2 : 1}}>
                <Navbar/>
                
                <div className={styles.selector}>
                    <div className={showing === "created" ? styles.selected : styles.option} onClick={() => setShowing("created")}>Created</div>
                    <div className={showing === "enrolled" ? styles.selected : styles.option} onClick={() => setShowing("enrolled")}>Enrolled</div>
                    {instructing?.length > 0 &&
                        <div className={showing === "instructing" ? styles.selected : styles.option} onClick={() => setShowing("instructing")}>Instructing</div>
                    }
                    <div className={showing === "searched" ? styles.selected : styles.option} onClick={() => setShowing("searched")}>Search</div>
                </div>

                {showing === "searched" &&
                    <div className={styles.searchbarContainer}>
                        <input className={styles.searchbar} type="text" name="search" placeholder="Search Modules..." value={query} onChange={(e) => setQuery(e.target.value)}/>
                        <div className={styles.searchButton}>
                            <FontAwesomeIcon className={styles.magnifyingGlass} icon={faMagnifyingGlass} onClick={search}/>
                        </div>
                    </div>
                }

                <div className={styles.window}>
                    <div className={styles.windowHeader}>
                        <h3 className={styles.headerLabel}>
                            {showing === "created" && "Created"}
                            {showing === "enrolled" && "Enrolled"}
                            {showing === "instructing" && "Instructing"}
                            {showing === "searched" && "Search"}
                        </h3>
                        {showing != "searched" && 
                            <a onClick={viewAllModules}>View All</a>
                        }
                    </div>
                    <div className={styles.windowContent}>
                        {showing === "created" &&
                            <Link className={styles2.modulepreviewContainer} to="/create-module">
                                <div className={styles2.modulepreview}>
                                    <div className={styles2.modulepreviewImage}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </div>
                                    <div>
                                        <span>{"Create Module"}</span>
                                    </div>
                                </div>
                            </Link>
                        }

                        {showing === "enrolled" &&
                            <Link className={styles2.modulepreviewContainer} to="/enroll">
                                <div className={styles2.modulepreview}>
                                    <div className={styles2.modulepreviewImage}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </div>
                                    <div>
                                        <span>{"Enroll in Section"}</span>
                                    </div>
                                </div>
                            </Link>
                        }

                        {showing === "created" && created}
                        {showing === "enrolled" && enrolled}
                        {showing === "instructing" && instructing}
                        {showing === "searched" && 
                            <>
                                {searched.length > 0 
                                ? 
                                    searched
                                :
                                    <span className={styles.resultMessage}>
                                        {searchedOnce ? "No Results" : "Search Something!"}
                                    </span>
                                }
                            </>
                        }
                    </div>
                </div>
            </main>

            {modalOpen &&
                <div className={styles.modal} onClick={(e) => {closeModal(e)}} id="outside">
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <span>{current.name}</span>
                            <div className={styles.empty}></div>
                            <button className={styles.closeButton} onClick={() => setModalOpen(false)}>X</button>
                        </div>

                        <div className={styles.content}>
                            {attemptingDelete 
                            ? 
                                <div className={styles.deletePrompt}>
                                    <span>Are you sure you want to delete this module?</span>
                                    <div>
                                        <button onClick={() => {setAttemptingDelete(false)}}>Cancel</button>
                                        <button className={styles.delete} onClick={() => {confirmDelete()}}>Delete</button>
                                    </div>
                                </div>
                            :
                                <span>{current.description}</span>
                            }
                        </div>

                        <hr/>
                        <div className={styles.footer}>
                            
                            {(current.type === "created" || current.type === "instructing") && 
                                <>
                                    <button onClick={() => {nav(`/module/${current.mid}`)}}>Preview</button>
                                    <button className={styles.edit} onClick={() => {nav(`/module/edit/${current.mid}`)}}>Edit</button>
                                </>
                            }
                            
                            {current.type === "created" && 
                                <>
                                    <button className={styles.delete} onClick={() => setAttemptingDelete(true)}>Delete</button>
                                </>
                            }
                            {(current.type === "enrolled" || current.type === "searched") && 
                                <>
                                    <button onClick={() => {nav(`/module/${current.mid}/section/${current.sid}`)}}>Start</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Modules;