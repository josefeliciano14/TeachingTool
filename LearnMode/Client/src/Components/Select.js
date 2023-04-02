import { useState } from "react";

import styles from '../Styles/Select.module.scss'

function Select(props){
    const [selected, setSelected] = useState(props.default === true);
    
    function updateSelection(){
        setSelected((prev) => {
            if(props.update){
                props.update(!prev);
            }
            
            return !prev;
        })
    }

    return(
        <div style={{backgroundColor: selected ? "var(--main-color)" : "var(--secondary-color)"}} className={styles.selected} onClick={() => {updateSelection()}}>
            <a style={{visibility:selected ? "visible" : "hidden"}}>X</a>
        </div>
    )
}

export default Select;