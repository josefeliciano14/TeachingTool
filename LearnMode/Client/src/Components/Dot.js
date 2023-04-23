import styles from '../Styles/Module.module.scss' 
import { useState } from 'react';

function Dot({x, y, width, height, text}){

    const [hidden, setHidden] = useState(true);

    function hideBox(){
        setHidden((prev) => {
            return !prev;
        });
    }

    return(
        <div className={styles.dotContainer} style={{left: x*width, top: y*height}}>
            <div className={styles.dot} onClick={hideBox}></div>
            <div className={styles.textBox} style={{display: hidden ? "none" : "block", left: "1vw"}}>
                <span>{text}</span>
            </div>
        </div>
    )
}

export default Dot;