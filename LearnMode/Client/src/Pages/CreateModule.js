import Navbar from "../Components/Navbar";
import styles from '../Styles/CreateModule.module.scss' 
import { useEffect, useState } from "react";
import Toggle from "../Components/Toggle";
import Select from "../Components/Select";
import QuestionForm from "../Components/QuestionForm";
import { BASE_URL, createModule, getModuleEdit, getRole } from "../api";
import DynamicContentForm from "../Components/DynamicContentForm";
import { useNavigate, useParams } from "react-router";

function CreateModule({edit}){

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

    const [role, setRole] = useState("");

    const {mid} = useParams();

    const nav = useNavigate();

    function sendRequest(){
        
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

        createModule(formData)
            .then(() => {
                nav("/");
            });
    }

    useEffect(() => {
        if(edit){
            getModuleEdit(mid)
                .then((res) => {
                    const module = res.data;

                    setName(module.info.name);
                    setDescription(module.info.description);
                    setCode(module.info.code);

                    let forms = [];
                    let info = [];

                    new Promise((resolve, reject) => {
                        module.content.map((content, index) => {
                            forms.push(
                                <DynamicContentForm key={index} index={index} content={content} isProfessor={true} setContentInfo={setContentInfo}/>
                            );
    
                            info.push(
                                {
                                    name: content.name,
                                    description: content.description,
                                    type: content.type,
                                    data: content.data,
                                    file: {},
                                    cid: content.cid
                                }
                            );

                            resolve();
                        });
                    })
                    .then(() => {
                        setContent(forms);
                        setContentInfo(info);

                        setCount(module.content.length);
                    });

                    console.log(module);

                    setTestName(module.evaluation.name);
                    setTestDescription(module.evaluation.description);
                    setTestEnabled(module.evaluation.is_enabled === 1 ? "Yes" : "No");
                    setIsDiagnostic(module.evaluation.is_diagnostic === 1 ? "Yes" : "No");

                    const eid = module.questions[0].eid;
                    let qid = module.questions[0].qid; 
        
                    let qList = [];
                    let aList = [];
                    let aList2 = [];
                    let qInfo = [];
                    new Promise((resolve, reject) => {
                        let current = {
                            qid: module.questions[0].qid,
                            prompt: module.questions[0].prompt,
                            information: module.questions[0].information,
                            image: module.questions[0].image
                        };
            
                        module.questions.map((q, index) => {
                            if(q.eid === eid){
                                if(q.qid === qid){
                                    aList.push(q.answer);
                                    aList2.push({oid: q.oid, answer: q.answer, selected: false});
                                }
                                else{
                                    //Wrap up current question 
                                    current.answers=aList;
                                    //qList.push(<Question key={index} qid={q.qid} index={qList.length} prompt={current.prompt} information={current.information} image={current.image} answers={aList} updateQuestionInfo={updateQuestionInfo}/>);
                                    qList.push(<QuestionForm key={index} index={qList.length} question={current} options={aList2} setQuestionInfo={setQuestionInfo}/>);
                                    current.answers=aList2;
                                    qInfo.push(current);
            
                                    //Start next one 
                                    qid = q.qid;
                                    aList = [q.answer];
                                    aList2 = [{oid: q.oid, answer: q.answer, selected: false}];
            
                                    current = {
                                        qid: q.qid,
                                        prompt: q.prompt,
                                        information: q.information,
                                        image: q.image
                                    };
                                }
                            }
                        });
            
                        current.answers=aList;
                        //qList.push(<Question key={qList.length} qid={current.qid} index={qList.length} prompt={current.prompt} information={current.information} image={current.image} answers={aList} updateQuestionInfo={updateQuestionInfo}/>);
                        qList.push(<QuestionForm key={qList.length} index={qList.length} question={current} options={aList2} setQuestionInfo={setQuestionInfo}/>);
                        current.answers=aList2;
                        qInfo.push(current);
            
                        console.log(qInfo);

                        resolve();
                    })
                    .then(() => {
                        setQuestions(qList);
                        setQuestionInfo(qInfo);
                    });
                    
                })
                .catch((err) => {
                    nav("/");
                });
        }
        else{
            addQuestion();

            getRole()
                .then((res) => {
                    if(res?.data?.is_professor === 1){
                        addContent(true);
                        setRole("professor");
                    }
                    else{
                        addContent(false);
                    }
                });
        }
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

    function addContent(is_professor){
        const newInfo = {
            name: "",
            description: "",
            type: "",
            data: {},
            file: {}
        };
        
        setContent((prev) => {
            return [...prev, <DynamicContentForm key={count} index={prev.length} setContentInfo={setContentInfo} isProfessor={is_professor}/>]
        });

        setContentInfo((prevInfo) => {
            return [...prevInfo, newInfo];
        });

        setCount((prev) => {
            return prev+1;
        });
    }

    return(
        <main>
            <Navbar/>

            <div className={styles.window} style={{display: page === 1 ? "block" : "none"}}>
                <div className={styles.header}>
                    <h3>{edit ? "Edit Module" : "Create Module"}</h3>
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

                            {(edit && mid && !moduleImg) &&
                                <img style={styles.moduleImg} src={`${BASE_URL}/modules/image/${mid}`}/>
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

            <div style={{display: page === 2 ? "block" : "none"}}>
                {content}

                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => {addContent(role === "professor")}}>+ Add Content</button>
                </div>
            </div>

            <div className={styles.window} style={{display: page === 3 ? "block" : "none"}}>
                <div className={styles.header}>
                    <h3>Create Module: Test</h3>
                </div>
                <div className={styles.content}>
                    <div className={styles.input}>
                        <label>Enable Test:</label>
                        {page === 3 &&
                            <Toggle leftText="Yes" rightText="No" default={edit ? testEnabled : "Yes"} update={setTestEnabled}/>
                        }
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
                        {page === 3 &&
                            <Toggle leftText="Yes" rightText="No" default={edit ? isDiagnostic : "No"} update={setIsDiagnostic}/>
                        }
                    </div>
                </div>
            </div>

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
                {(page < 4 && !(page === 3 && testEnabled === "No")) &&
                    <button className={styles.button} onClick={() => setPage((prev) => {return prev+1;})}>Next</button>
                }
                {(page === 4 || (page === 3 && testEnabled === "No")) &&
                    <button className={styles.button} onClick={() => sendRequest()}>Submit</button>
                }
            </div>
        </main>
    )
}

export default CreateModule;