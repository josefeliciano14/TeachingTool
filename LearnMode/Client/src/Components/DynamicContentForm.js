import { useEffect, useRef, useState } from 'react';
import styles from '../Styles/CreateModule.module.scss' 

function DynamicContentForm({index, setContentInfo}){
    const [type, setType] = useState("");
    const [img, setImg] = useState();
    const [imgFile, setImgFile] = useState();
    const [dots, setDots] = useState([]);
    const [count, setCount] = useState(0);
    const [dotInfo, setDotInfo] = useState([]);

    const imgRef = useRef();
    
    const typeOptions = [
        "Text", "Image", "Dynamic Image", "Webpage", "Custom"
    ]

    useEffect(() => {
        setType(typeOptions[0]);
    }, []);

    useEffect(() => {
        setContentInfo((prev) => {
            prev[index].type = type;

            if(type === "Text"){
                prev[index].data = {text: ""};
            }
            else if(type === "Image"){
                prev[index].data = {text: "", image: null};
            }
            else if(type === "Dynamic Image"){
                prev[index].data = {dots: [], image: null};
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

    function imgChange(e){
        if(e?.target?.files[0]){
            updateContentInfo("image", e.target.files[0].name.split(".")[1], true);
            
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = function() {
                setImgFile(file);
                setImg(reader.result);
            }

            updateContentInfo("file", file);
        }
    }

    function addDot(e){
        if(e.target.localName === "img"){
            const width = e.target.width;
            const height = e.target.height;
            const x = e.pageX - e.currentTarget.offsetLeft - 15;
            const y = e.pageY - e.currentTarget.offsetTop - 15;
            
            setDots([...dots, 
                <div key={count} dot_id={count} className={styles.dotContainer} style={{left: x, top: y}} onContextMenu={(e) => {removeDot(e, count)}}>
                    <div className={styles.dot} onClick={() => {clickedDot(count)}}></div>
                    <div className={styles.dotText} style={{display: "block"}}>
                        <input type="text" onChange={(e) => {updateText(count, e.target.value)}}/>
                    </div>
                </div>
            ]);

            const xpercentage = Math.round((x/width)*10000)/10000;
            const ypercentage = Math.round((y/height)*10000)/10000;

            setDotInfo((prev) => {
                prev.push({id: count, x: x, y: y, xp: xpercentage, yp: ypercentage, open: true, text: ""});

                updateContentInfo("dots", 
                    prev.map((dot) => {
                        return {xp: dot.xp, yp: dot.yp, text: dot.text}
                    })
                , true);

                return prev;
            })

            setCount((prev) => {return prev+1;});
        }
    }

    function clickedDot(id){
        setDotInfo((prevInfo) => {
            let index = prevInfo.findIndex((dot) => {
                return dot.id === id;
            });
            
            prevInfo[index].open = !prevInfo[index].open;
            
            setDots((prevDots) => {
                return prevInfo.map((dot) => {

                    return(
                        <div key={dot.id} dot_id={dot.id} className={styles.dotContainer} style={{left: dot.x, top: dot.y}} onContextMenu={(e) => {removeDot(e, dot.id)}}>
                            <div className={styles.dot} onClick={() => {clickedDot(dot.id)}}></div>
                            <div className={styles.dotText} style={{display: dot.open ? "block" : "none"}}>
                                <input type="text" onChange={(e) => {updateText(id, e.target.value)}} defaultValue={dot.text}/>
                            </div>
                        </div>
                    )
                });
            });

            return prevInfo;
        });
    }

    function removeDot(e, id){
        e.preventDefault();

        setDotInfo((prev) => {
            let result = prev.filter((dot) => {
                return dot.id != id;
            });

            updateContentInfo("dots", 
                result.map((dot) => {
                    return {xp: dot.xp, yp: dot.yp, text: dot.text}
                })
            , true);

            return result;
        });

        setDots((prev) => {
            return prev.filter((dot) => {
                return dot.props.dot_id != id;
            });
        });
    }

    function updateText(id, value){
        setDotInfo((prev) => {
            let index = prev.findIndex((dot) => {
                return dot.id === id;
            });

            prev[index].text = value;

            updateContentInfo("dots", 
                prev.map((dot) => {
                    return {xp: dot.xp, yp: dot.yp, text: dot.text}
                })
            , true);

            return prev;
        });
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
                <div className={styles.typeOptions}>
                    {type === "Image" &&
                        <div className={styles.imgInput}>
                            <label>Image:</label>
                            <input type="file" onChange={imgChange}/>
                            <div className={styles.imgContainer}>
                                {img &&
                                    <img style={styles.moduleImg} src={img}/>
                                }
                            </div>
                        </div>
                    }
                    {(type === "Text" || type === "Image") && 
                        <div className={styles.textInfo}>
                            <input type="text" placeholder='Text Here' onChange={(e) => {updateContentInfo("text", e.target.value, true)}}/>
                        </div>
                    }
                    {type === "Custom" &&
                        <div className={styles.fileInput}>
                            <input type="file" onChange={(e) => {handleFileChange(e)}}/>
                        </div>
                    }
                    {type === "Dynamic Image" &&
                        <>
                            <div className={styles.dynamicImageInput}>
                                <label>Image:</label>
                                <input type="file" onChange={imgChange}/>
                            </div>
                            <div className={styles.dynamicImageContainer} style={{minHeight: img ? "0px" : "200px"}} onClick={(e) => {addDot(e)}}>
                                <div className={styles.dotsContainer}>
                                    {dots}
                                </div>
                                <img style={styles.dynamicImage} src={img} ref={imgRef}/>
                            </div>
                        </>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default DynamicContentForm;