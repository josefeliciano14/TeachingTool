import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../Components/Navbar";
import ModulePreview from "../Components/ModulePreview";
import { Link } from "react-router-dom";

import { faMagnifyingGlass, faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons'

import './../Styles/Modules.scss';
import './../Styles/ModulePreview.scss';
import { useEffect, useState } from "react";

import {getMyModules, getMyModulesLimit, searchModules} from '../api/index.js'

function Modules(){
    
    const [modules, setModules] = useState([]);
    const [viewingAll, setViewingAll] = useState(false);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        reset();
    }, []);

    function viewAllModules(){
        getMyModules().then((res) => {
            let list = [];
            if(res?.data?.map){
                res.data.map((m, index) => {
                    list.push(<ModulePreview key={index} module={m}/>)
                });

                setModules(list);

                setViewingAll(true);
            }
        });
    }

    function search(){
        console.log(query);
        
        searchModules(query)
            .then((res) => {
                let list = [];
                if(res?.data?.map){
                    res.data.map((m, index) => {
                        list.push(<ModulePreview key={index} module={m}/>)
                    });

                    setModules(list);
                }
            });

        setSearching(true);
    }

    function reset(){
        
        getMyModulesLimit(5).then((res) => {
            let list = [];
            if(res?.data?.map){
                res.data.map((m, index) => {
                    list.push(<ModulePreview key={index} module={m}/>)
                });

                setModules(list);
            }
        });

        setSearching(false);
    }
    
    return(
        <main>
            <Navbar/>
            <div className="searchbar-container">
                <input className="searchbar" type="text" name="search" placeholder="Search Modules..." value={query} onChange={(e) => setQuery(e.target.value)}/>
                <div className="search-button">
                    <FontAwesomeIcon className="magnifying-glass" icon={faMagnifyingGlass} onClick={search}/>
                </div>
            </div>

            <div className="window">
                <div className="window-header">
                    <h3>{searching ? "Search Results" : "My Modules"}</h3>
                    {(!viewingAll && !searching) &&
                        <a onClick={viewAllModules}>View All</a>
                    }

                    {searching &&
                        <a onClick={reset}>Go Back</a>
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

                    {modules}
                </div>
            </div>
        </main>
    )
}

export default Modules;