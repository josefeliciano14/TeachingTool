import { Link } from "react-router-dom";

import './../Styles/ModulePreview.scss';

function ModulePreview({imageSource, title, url}){
    
    return(
        <Link className="modulepreview-container" to={url}>
            <div className="modulepreview">
                <img className="modulepreview-image" src={"https://th.bing.com/th/id/R.b38a3048a6d7f1991ab400ddc335e693?rik=eZprSG677iRMSQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f_Q_ZJiaCqn38%2fTFIu3dkYfxI%2fAAAAAAAAACo%2f63Vuzi-IG4A%2fs1600%2fSCIENCE.png&ehk=iY0fF%2ff3TwOqGCFvG%2bjEyr05%2bDdtOpdJ1lI2UdY1RIg%3d&risl=&pid=ImgRaw&r=0"/*imageSource*/}/>
                <div>
                    <span>{"Science Fundamentals"/*title*/}</span>
                </div>
            </div>
        </Link>
    )
}

export default ModulePreview;