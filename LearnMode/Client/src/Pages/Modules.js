import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../Components/Navbar";
import ModulePreview from "../Components/ModulePreview";
import { Link } from "react-router-dom";

import { faMagnifyingGlass, faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons'

import './../Styles/Modules.scss';
import './../Styles/ModulePreview.scss';

function Modules(){
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
                    <Link to="/my-modules">View All</Link>
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
                    <ModulePreview/>
                    <ModulePreview/>
                    <ModulePreview/>
                </div>
            </div>

            <div className="window">
                <div className="window-header">
                    <h3>Browse Modules</h3>
                    <Link to="/browse-modules">Browse</Link>
                </div>
                <div className="window-content">
                    <ModulePreview/>
                    <ModulePreview/>
                    <ModulePreview/>
                </div>
            </div>
        </main>
    )
}

export default Modules;