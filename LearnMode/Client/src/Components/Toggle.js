import { useState } from "react";

import styles from '../Styles/Toggle.module.scss'

function Toggle(props){
    
    const [selected, setSelected] = useState(props.default ? props.default : props.leftText);

    function selectionChanged(selection){
        setSelected(selection);

        if(props.update){
            props.update(selection);
        }
    }
    
    return(
        <div className={styles.toggle}>
            <div className={selected === props.leftText ? styles.selected : ""} onClick={() => selectionChanged(props.leftText)}>{props.leftText}</div>
            <div className={selected === props.rightText ? styles.selected : ""} onClick={() => selectionChanged(props.rightText)}>{props.rightText}</div>
        </div>
    )
}

export default Toggle;