import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../Components/Navbar";
import ModulePreview from "../Components/ModulePreview";
import { Link } from "react-router-dom";

import { faMagnifyingGlass, faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons'

import './../Styles/Modules.scss';
import './../Styles/ModulePreview.scss';
import { useEffect, useState } from "react";

import {getMyModules, getMyModulesLimit} from '../api/index.js'

function Modules(){
    
    const [myModules, setMyModules] = useState([]);
    const [viewingAll, setViewingAll] = useState(false);

    useEffect(() => {
        getMyModulesLimit(5).then((res) => {
            let list = [];
            if(res?.data?.map){
                res.data.map((m, index) => {
                    list.push(<ModulePreview key={index} module={m}/>)
                });

                setMyModules(list);
            }
        });
    }, []);

    function viewAllModules(){
        getMyModules().then((res) => {
            let list = [];
            if(res?.data?.map){
                res.data.map((m, index) => {
                    list.push(<ModulePreview key={index} module={m}/>)
                });

                setMyModules(list);

                setViewingAll(true);
            }
        });
    }
    
    return(
        <main>
            <Navbar/>
            <div className="searchbar-container">
                <input className="searchbar" type="text" name="search" placeholder="Search Modules..."/>
                <div className="search-button">
                    <FontAwesomeIcon className="magnifying-glass" icon={faMagnifyingGlass}/>
                </div>
            </div>

            <div className="window">
                <div className="window-header">
                    <h3>My Modules</h3>
                    {!viewingAll &&
                        <a onClick={viewAllModules}>View All</a>
                    }
                </div>
                <div className="window-content">
                    <Link className="modulepreview-container" to="/create-module">
                        <div className="modulepreview">
                            <div className="modulepreview-image">
                                <FontAwesomeIcon icon={faPlus}/>
                            </div>
                            <div>
                                <span>{"Create Module"}</span>
                            </div>
                        </div>
                    </Link>

                    {myModules}
                </div>
            </div>
        </main>
    )
}

export default Modules;