import styles from '../Styles/CreateModule.module.scss' 
import Select from './Select';
import { useEffect, useState } from 'react';
import { useReducer } from 'react';

function QuestionForm({index, question, setQuestionInfo, updateAnswerInfo, options}){
    
    const [answers, setAnswers] = useState([]);
    const [count, setCount] = useState(0);
    const [questionImg, setQuestionImg] = useState();
    
    function createAnswer(answer, answerIndex){
        return(
            <div key={`${index}-${answerIndex}`} index={answerIndex} className={styles.answer}>
                <Select default={answer.correct} update={(value) => {updateAnswerInfo(index, answerIndex, "correct", value)}}/>
                <input type="text" placeholder="Write Answer" defaultValue={answer.answer} onChange={(e) => updateAnswerInfo(index, answerIndex, "answer", e.target.value)}/>
                <div className={styles.remove} onClick={() => {removeAnswer(answerIndex);}}><a>X</a></div>
            </div>
        )
    }

    function addAnswer(){
        setAnswers((prev) => {
            return [...prev, createAnswer(newInfo, prev.length)];
        });

        setQuestionInfo((prev) => {
            prev[index].answers.push({
                answerIndex: prev[index].answers.length,
                correct: false,
                answer: ""
            });
            
            return prev;
        });

        setCount((prev) => {
            return prev+1;
        });
    }

    function removeAnswer(answerIndex){
        setAnswers((prev) => {
            return prev.filter((answer) => {
                return answer.props.index != answerIndex;
            });
        });

        setQuestionInfo((prevQ) => {
            prevQ[index].answers = prevQ[index].answers.filter((answer) => {
                return answer.answerIndex != answerIndex;
            });

            return prevQ;
        });
    }

    const newInfo = {
        correct: false,
        answer: ""
    }

    useEffect(() => {
        if(options?.length > 0){
            setAnswers(
                options?.map((a, index) => {
                    console.log(a);
                    
                    let info = {
                        correct: a.selected,
                        answer: a.answer
                    };

                    return createAnswer(info, index);
                })
            );
            
            setCount(answers?.length);
        }
        else{
            setAnswers([
                createAnswer(newInfo, 0),
                createAnswer(newInfo, 1)
            ]);
    
            setCount(2);
        }
    }, []);

    
    function updateQuestionInfo(index, field, value){
        console.log(`Index: ${index}, Field: ${field}, Value: ${value}`)
        
        setQuestionInfo((prev) => {
            prev[index][field] = value;

            return prev;
        });
    }

    function updateAnswerInfo(questionIndex, answerIndex, field, value){
        setQuestionInfo((prev) => {
            prev[questionIndex].answers[answerIndex][field] = value;

            return prev;
        });
    }

    function questionImgChange(e, index){
        if(e?.target?.files[0]){
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = function() {
                setQuestionImg(reader.result);
            }

            updateQuestionInfo(index, "image", file);
        }
    }
    
    return(
        <div className={styles.window}>
            <div className={styles.header}>
                <h3>Test Question {index+1}</h3>
            </div>
            <div className={styles.content}>
                <div className={styles.largeInput}>
                    <label htmlFor={`prompt${index}`}>Prompt:</label>
                    <input name={`prompt${index}`} id={`prompt${index}`} type="text" defaultValue={question.prompt} onChange={(e) => updateQuestionInfo(index, "prompt", e.target.value)}/>
                </div>
                <div className={styles.largeInput}>
                    <label htmlFor={`description${index}`}>Description:</label>
                    <textarea name={`description${index}`} id={`description${index}`} defaultValue={question.description} onChange={(e) => updateQuestionInfo(index, "description", e.target.value)}/> 
                </div>
                <div className={styles.imgInput}>
                    <label>Image:</label>
                    <input type="file" onChange={(e) => questionImgChange(e, index)}/>
                    {questionImg &&
                        <div className={styles.imgContainer}>
                            <img style={styles.moduleImg} src={questionImg}/>
                        </div>
                    }
                </div>
                <a className={styles.options}>Options - Select correct answer(s):</a>
                {answers}
                <div className={styles.buttonContainer} style={{marginTop:"20px"}}>
                    <button className={styles.button} onClick={() => {addAnswer()}}>+ Add Option</button>
                </div>
            </div>
        </div>
    )
}

export default QuestionForm;