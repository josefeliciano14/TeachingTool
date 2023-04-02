import Navbar from "../Components/Navbar";
import styles from '../Styles/CreateModule.module.scss' 
import { useEffect, useState } from "react";
import Toggle from "../Components/Toggle";
import Select from "../Components/Select";
import QuestionForm from "../Components/QuestionForm";
import { createModule } from "../api";
import DynamicContentForm from "../Components/DynamicContentForm";

function CreateModule(){

    const [page, setPage] = useState(1);
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [moduleImg, setModuleImg] = useState();
    const [moduleImgFile, setModuleImgFile] = useState();
    const [visibility, setVisibility] = useState("Private");
    const [code, setCode] = useState("");

    const [content, setContent] = useState([]);
    const [contentInfo, setContentInfo] = useState([]);

    const [testEnabled, setTestEnabled] = useState("Yes");
    const [testName, setTestName] = useState("");
    const [testDescription, setTestDescription] = useState("");
    const [isDiagnostic, setIsDiagnostic] = useState("No");

    const [questions, setQuestions] = useState([]);
    const [questionInfo, setQuestionInfo] = useState([]);
    const [count, setCount] = useState(0);

    function sendRequest(){
        
        console.log(questionInfo);
        
        const formData = new FormData();
        if(moduleImgFile){
            formData.append('img', moduleImgFile);
        }



        contentInfo.map((content, index) => {
            if(content.file){
                console.log("Adding content file");
                formData.append(`c${index}`, content.file);
            }
            else{
                console.log("No content file");
            }

            //delete content.file;
        });

        questionInfo.map((question, index) => {
            if(question.image){
                formData.append(`q${index}`, question.image);
            }
            
            //delete question.image;
        });

        formData.append('data', JSON.stringify({
            name: name,
            description: description,
            is_public: visibility === "Public",
            code: code,

            content: contentInfo,

            evaluationEnabled: testEnabled === "Yes",
            evaluationName: testName,
            evaluationDescription: testDescription,
            is_diagnostic: isDiagnostic === "Yes",

            questions: questionInfo
        }));
        
        createModule(formData);
    }

    useEffect(() => {
        //addContent();

        addQuestion();
    }, []);

    function addQuestion(){
        const newInfo = {
            prompt: "",
            description: "",
            image: "",
            answers: [
                {
                    answerIndex: 0,
                    correct: false,
                    answer: ""
                },
                {
                    answerIndex: 1,
                    correct: false,
                    answer: ""
                }
            ]
        };

        setQuestionInfo((prevInfo) => {
            return [...prevInfo, newInfo];
        });

        setQuestions((prevQ) => {
            return [...prevQ, <QuestionForm key={count} index={prevQ.length} question={newInfo} setQuestionInfo={setQuestionInfo}/>];
        });

        setCount((prev) => {
            return prev+1;
        });
    }

    function removeQuestion(index){
        console.log(`Removing question ${index}`);
        
        setQuestionInfo((prevInfo) => {
            delete prevInfo[index];

            return prevInfo;
        });

        setQuestions((prevQ) => {
            delete prevQ[index];

            return prevQ;
        });
    };

    function moduleImgChange(e){
        if(e?.target?.files[0]){
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = function() {
                setModuleImgFile(file);
                setModuleImg(reader.result);
            }
        }
    }

    function addContent(){
        const newInfo = {
            name: "",
            type: "",
            data: {},
            file: {}
        };
        
        setContent((prev) => {
            return [...prev, <DynamicContentForm key={count} index={prev.length} setContentInfo={setContentInfo}/>]
        });

        setContentInfo((prevInfo) => {
            return [...prevInfo, newInfo];
        });

        setCount((prev) => {
            return prev+1;
        });
    }

    useEffect(() => {
        console.log(contentInfo);
    }, [contentInfo]);

    return(
        <main>
            <Navbar/>

            {page === 1 &&
            <div className={styles.window}>
                <div className={styles.header}>
                    <h3>Create Module</h3>
                </div>
                <div className={styles.content}>
                    <div className={styles.largeInput}>
                        <label htmlFor="name">Name:</label>
                        <input name="name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className={styles.largeInput}>
                        <label htmlFor="description">Description:</label>
                        <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/> 
                    </div>
                    <div className={styles.imgInput}>
                        <label>Image:</label>
                        <input type="file" onChange={moduleImgChange}/>
                        <div className={styles.imgContainer}>
                            {moduleImg &&
                                <img style={styles.moduleImg} src={moduleImg}/>
                            }
                        </div>
                    </div>
                    <div className={styles.input}>
                        <label>Visibility:</label>
                        <Toggle leftText="Public" rightText="Private" default="Private" update={setVisibility}/>
                    </div>
                    <div className={styles.bottom}>
                        <label htmlFor="code">Code (Optional):</label>
                        <input name="code" id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)}/>
                    </div>
                </div>
            </div>
            }

            <div style={{display: page === 2 ? "block" : "none"}}>
                {content}

                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => {addContent()}}>+ Add Content</button>
                </div>
            </div>

            {page === 3 &&
            <div className={styles.window}>
                <div className={styles.header}>
                    <h3>Create Module: Test</h3>
                </div>
                <div className={styles.content}>
                    <div className={styles.input}>
                        <label>Enable Test:</label>
                        <Toggle leftText="Yes" rightText="No" default="Yes" update={setTestEnabled}/>
                    </div>
                    <div className={styles.largeInput}>
                        <label htmlFor="testname">Test Name:</label>
                        <input name="testname" id="testname" type="text" value={testName} onChange={(e) => setTestName(e.target.value)}/>
                    </div>
                    <div className={styles.largeInput}>
                        <label htmlFor="testdescription">Description:</label>
                        <textarea name="testdescription" id="testdescription" value={testDescription} onChange={(e) => setTestDescription(e.target.value)}/> 
                    </div>
                    <div className={styles.bottom}>
                        <label>Also Use As Diagnostic Test:</label>
                        <Toggle leftText="Yes" rightText="No" default="No" update={setIsDiagnostic}/>
                    </div>
                </div>
            </div>
            }

            <div style={{display: page === 4 ? "block" : "none"}}>
                {questions}

                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => {addQuestion()}}>+ Add Question</button>
                </div>
            </div>

            <div className={styles.buttonContainer}>
                {page > 1 && 
                <button className={styles.button} onClick={() => setPage((prev) => {return prev-1;})}>Prev</button>
                }
                {page < 4 &&
                <button className={styles.button} onClick={() => setPage((prev) => {return prev+1;})}>Next</button>
                }
                {page === 4 &&
                <button className={styles.button} onClick={() => sendRequest()}>Submit</button>
                }
            </div>
        </main>
    )
}

export default CreateModule;