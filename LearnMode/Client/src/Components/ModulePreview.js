import { Link } from "react-router-dom";
import styles from '../Styles/ModulePreview.module.scss';
import { BASE_URL } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

function ModulePreview({module, onClick}){

    // to={`/module/${module.mid}`

    return(
        <Link className={styles.modulepreviewContainer} onClick={onClick}>
            <div className={styles.modulepreview}>
                {module?.image ? 
                    <img className={styles.modulepreviewImage} src={`${BASE_URL}/modules/image/${module.mid}`}/>   
                :
                    <div className={styles.modulepreviewImage}>
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