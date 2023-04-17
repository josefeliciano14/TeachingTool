import { useEffect, useState } from 'react';
import styles from '../Styles/CreateModule.module.scss' 

function DynamicContentForm({index, setContentInfo}){
    const [type, setType] = useState("");
    
    const typeOptions = [
        "Text", "Image", "Dynamic Image", "Webpage", "Custom"
    ]

    useEffect(() => {
        setType(typeOptions[0]);
    }, []);

    useEffect(() => {
        setContentInfo((prev) => {
            prev[index].type = type;

            if(type === "Text" || type === "Image"){
                prev[index].data = {text: ""};
            }
            else if(type === "Webpage"){
                prev[index].data = {link: ""};
            }

            prev[index].file = {};
            
            return prev;
        });
    }, [type]);

    function updateContentInfo(field, value, inData){
        setContentInfo((prev) => {
            console.log(prev);

            if(inData){
                prev[index].data[field]=value;
            }
            else{
                prev[index][field]=value;
            }
            
            return prev;
        });
    }

    function handleFileChange(e){
        if(e?.target?.files[0]){
            const file = e.target.files[0];

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
                {type === "Text" && 
                    <input type="text" onChange={(e) => {updateContentInfo("text", e.target.value, true)}}/>
                }
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