import { useEffect, useState } from 'react';
import styles from '../Styles/CreateModule.module.scss' 

function DynamicContentForm({index, setContentInfo}){
    const [type, setType] = useState("");
    const [data, setData] = useState({});
    const [file, setFile] = useState();
    
    const typeOptions = [
        "Dynamic Image", "Custom"
    ]

    useEffect(() => {
        setType(typeOptions[0]);
    }, []);

    function updateContentInfo(field, value){
        setContentInfo((prev) => {
            prev[index][field]=value;
            
            return prev;
        });
    }

    function handleFileChange(e){
        if(e?.target?.files[0]){
            const file = e.target.files[0];

            setFile(file);

            updateContentInfo("file", file);
        }
    }
    
    return(
        <div className={styles.window}>
            <div className={styles.header}>
                <h3>Dynamic Content {index+1}</h3>
            </div>
            <div className={styles.content} style={{alignItems: "center"}}>
                <div className={styles.largeInput}>
                    <label htmlFor={`name${index}`}>Name:</label>
                    <input name={`name${index}`} id={`name${index}`} type="text" defaultValue={""} onChange={(e) => updateContentInfo("name", e.target.value)}/>
                </div>
                <div className={styles.largeInput}>
                    <label htmlFor={`description${index}`}>Description:</label>
                    <textarea name={`description${index}`} id={`description${index}`} defaultValue={""} onChange={(e) => updateContentInfo("description", e.target.value)}/> 
                </div>
                <div className={styles.bottom}>
                    <label htmlFor="content">Content Type:</label>
                    <select name="content" id="content" value={type} onChange={(e) => {setType(e.target.value); updateContentInfo("type", e.target.value);}}>
                        {typeOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>
                        })}
                    </select>
                </div>
                {type === "Custom" &&
                    <div className={styles.fileInput}>
                        <input type="file" onChange={(e) => {handleFileChange(e)}}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default DynamicContentForm;