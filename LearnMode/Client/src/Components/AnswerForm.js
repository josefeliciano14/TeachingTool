import styles from '../Styles/CreateModule.module.scss' 
import Select from './Select';

function AnswerForm({index, answerIndex, updateAnswerInfo, removeAnswer}){
    return(
        <div className={styles.option}>
            <Select update={(value) => {updateAnswerInfo(index, answerIndex, "correct", value)}}/>
            <input type="text" placeholder="Write Answer" onChange={(e) => updateAnswerInfo(index, answerIndex, "answer", e.target.value)}/>
            <div className={styles.remove} onClick={() => {removeAnswer(answerIndex);}}><a>X</a></div>
        </div>
    )
}

export default AnswerForm;