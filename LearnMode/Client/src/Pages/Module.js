import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../Components/Navbar";
import {BASE_URL, getModule, getModuleSection, getModuleWithCode} from '../api/index.js';
import styles from '../Styles/Module.module.scss';
import Question from "../Components/Module/Question";
import { API } from "../api/index.js";
import Dot from "../Components/Dot";

function Module({submitOnCompletion}){
    
    const {mid, sid} = useParams();
    const [data, setData] = useState({});
    const [sequence, setSequence] = useState(["Intro"]);
    const [state, setState] = useState(0);
    const [cIndex, setCIndex] = useState(0);
    const [questions, setQuestions] = useState([]); 
    const [questionInfo, setQuestionInfo] = useState({});
    const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
    const [needCode, setNeedCode] = useState(false);
    const [incorrectCode, setIncorrectCode] = useState(false);
    const [code, setCode] = useState("");
    const [dots, setDots] = useState([]);

    const [payload, setPayload] = useState({});

    const ref = useRef();

    const nav = useNavigate();

    useEffect(() => {
        
        if(sid){
            getModuleSection(mid, sid)
            .then((res) => {
                console.log(res.data);

                setData(res.data);
            });
        }
        else{
            getModule(mid)
            .then((res) => {
                console.log(res);
                
                setData(res.data);
            })
            .catch((err) => {
                const error_code = err?.response?.status;
                const message = err?.response?.data?.message;

                if(error_code === 403 && message === "enter code"){
                    setNeedCode(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        let s = ["Intro"];
        let p = {};
        
        if(data?.questions?.length && data.questions.length > 0 && data.questions[0].is_diagnostic){
            s.push("Diagnostic");
            p.diagnostic = {};
        }
        if(data?.content?.length && data.content.length > 0){
            s.push("Content");
        }
        if(data?.questions?.length && data.questions.length){
            s.push("Evaluation");
            p.evaluation = {};
        }

        setSequence(s);
        setPayload(p);
        
        //Setup questions 
        if(data?.questions?.length && data.questions.length > 0){
            const eid = data.questions[0].eid;
            let qid = data.questions[0].qid; 

            let qList = [];
            let aList = [];
            let aList2 = [];
            let qInfo = [];

            let current = {
                qid: data.questions[0].qid,
                prompt: data.questions[0].prompt,
                information: data.questions[0].information,
                image: data.questions[0].image
            };

            data.questions.map((q, index) => {
                if(q.eid === eid){
                    if(q.qid === qid){
                        aList.push(q.answer);
                        aList2.push({oid: q.oid, answer: q.answer, selected: false});
                    }
                    else{
                        //Wrap up current question 
                        current.answers=aList;
                        qList.push(<Question key={index} index={qList.length} prompt={current.prompt} information={current.information} image={current.image} answers={aList} updateQuestionInfo={updateQuestionInfo}/>);
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
            qList.push(<Question key={qList.length} index={qList.length} prompt={current.prompt} information={current.information} image={current.image} answers={aList} updateQuestionInfo={updateQuestionInfo}/>);
            current.answers=aList2;
            qInfo.push(current);

            console.log(qInfo);

            setQuestions(qList);
            setQuestionInfo(qInfo);
        }
    }, [data]);

    function nextSection(){
        
        if(sequence[state] === "Content" && cIndex < data.content.length-1){
            setCIndex((prev) =>{
                return prev+1;
            });

            return;
        }

        if(state < sequence.length){
            setState((prev) => {
                console.log(`Setting state to ${prev+1}`);
                console.log("Which means that we are currently in " + sequence[state+1]);
                
                return prev+1;
            });
        }
        else{
            console.log("End of module");
        }
    }

    function updateQuestionInfo(index, aIndex, value){
        setQuestionInfo((prev) => {
            prev[index].answers[aIndex].selected = value;

            console.log(prev);

            return prev;
        });
    }

    function submitEvaluation(){
        
        if(sequence[state] === "Diagnostic"){
            console.log("Submitting diagnostic");
                        
            /*setQuestionInfo((qInfo) => {
                setPayload((pl) => {
                    pl.diagnostic = JSON.stringify(qInfo);
                    return pl;
                });

                qInfo = qInfo.map((q) => {
                    q.answers = q.answers.map((a) => {
                        a.selected = false;
                        
                        return a;
                    });
                    
                    return q;
                });

                console.log(qInfo);

                return qInfo;
            });*/

            setQuestionInfo((qInfo) => {
                setPayload((pl) => {
                    pl.diagnostic = JSON.parse(
                        JSON.stringify(
                            qInfo.map((q) => {
                                return q.answers;
                            })
                        )
                    );
                    
                    return pl;
                });

                qInfo = qInfo.map((q) => {
                    q.answers = q.answers.map((a) => {
                        a.selected = false;
                        return a;
                    });

                    return q;
                });

                return qInfo;
            });
        }
        else if(sequence[state] === "Evaluation"){
            payload.evaluation = questionInfo;
            
            console.log(payload);
        }

        //Make sure to validate 
        /*if(submitOnCompletion && data.role != "instructor" && data.role != "creator"){

        }*/

        console.log(questionInfo);

        nextSection();
    }

    function enterCode(){
        setIncorrectCode(false);

        getModuleWithCode(mid, code)
        .then((res) => {
            console.log(res);
            
            setData(res.data);

            setNeedCode(false);
        })
        .catch((err) => {
            setIncorrectCode(true);
        });
    }

    function loadedImage(){
        if(sequence[state] === "Content" && data?.content[cIndex]?.type === "Dynamic Image"){
            setDots(
                data?.content[cIndex]?.data?.dots?.map((dot, index) => {
                    return <Dot key={index} x={dot.xp} y={dot.yp} width={ref.current.width} height={ref.current.height} text={dot.text}/>
                })
            );
        }
    }
    
    return(
        <main>
            <Navbar/>

            {needCode &&
                <div className={styles.window}>
                    <div className={styles.header}>
                        Enter code to proceed to module
                    </div>
                    <div className={styles.content}>
                        
                        {incorrectCode &&
                            <span>Incorrect Code. Try Again.</span>
                        }

                        <input className={styles.codeInput} type="text" value={code} onChange={(e) => {setCode(e.target.value)}}/>

                        <div className={styles.buttonContainer}>
                            <button onClick={enterCode}>Enter</button>
                        </div>
                    </div>
                </div>
            }

            {data?.info &&
                <>
                    {sequence[state] === "Intro" &&
                        <div className={styles.window}>
                            <div className={styles.header}>
                                {data?.info?.name || "Error"}
                            </div>
                            <div className={styles.content}>
                                {data?.info?.description}

                                <div className={styles.buttonContainer}>
                                    <button onClick={nextSection}>Start</button>
                                </div>
                            </div>
                        </div>
                    }

                    {(sequence[state] === "Diagnostic" || sequence[state] === "Evaluation") &&
                        <>
                            {questions}

                            <div className={styles.buttonContainer}>
                                <button onClick={() => {submitEvaluation()}}>Submit</button>
                            </div>
                        </>
                    }

                    {sequence[state] === "Content" &&
                        <>
                            {data.content[cIndex].type === "Custom" &&
                                <div className={styles.contentContainer}>
                                    <iframe src={`${BASE_URL}/content/${data.content[cIndex].cid}.html`}/>
                                </div>
                            }

                            {data.content[cIndex].type === "Text" &&
                                <div className={styles.window}>
                                    <div className={styles.header}>
                                        {data.content[cIndex].name}
                                    </div>
                                    <div className={styles.content}>
                                        <p>{data.content[cIndex].data.text}</p>
                                    </div>
                                </div>
                            }

                            {data.content[cIndex].type === "Image" &&
                                <div className={styles.window}>
                                    <div className={styles.header}>
                                        {data.content[cIndex].name}
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.imgContainer}>
                                            <img className={styles.img} src={`${BASE_URL}/content/${data.content[cIndex].cid}.${data.content[cIndex].data.image}`}/>
                                        </div>
                                        <p>{data.content[cIndex].data.text}</p>
                                    </div>
                                </div>
                            }

                            {data.content[cIndex].type === "Dynamic Image" &&
                                <div className={styles.dynamicImage}>
                                    <div className={styles.dotsContainer}>
                                        {dots}
                                    </div>
                                    <img ref={ref} src={`${BASE_URL}/content/${data.content[cIndex].cid}.${data.content[cIndex].data.image}`} onLoad={loadedImage}/>
                                </div>
                            }

                            <div className={styles.buttonContainer}>
                                <button onClick={nextSection}>Next</button>
                            </div>
                        </>
                    }

                    {(!sequence[state] && !needCode) &&
                        <>
                            <div className={styles.window}>
                                <div className={styles.header}>
                                    End of Module
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.buttonContainer}>
                                        <button onClick={() => nav("/")}>Exit</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </main>
    )
}

export default Module;