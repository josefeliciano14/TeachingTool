import { Link } from "react-router-dom";
import './../Styles/ModulePreview.scss';
import { BASE_URL } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

function ModulePreview({module}){

    return(
        <Link className="modulepreview-container" to={`/module/${module.mid}`}>
            <div className="modulepreview">
                {module?.image ? 
                    <img className="modulepreview-image" src={`${BASE_URL}/modules/image/${module.mid}`}/>   
                :
                    <div className="modulepreview-image">
                        <FontAwesomeIcon icon={faQuestion}/>
                    </div>
                }
                <div>
                    <span>{module.name}</span>
                </div>
            </div>
        </Link>
    )
}

export default ModulePreview;