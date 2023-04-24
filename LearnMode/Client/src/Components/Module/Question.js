import styles from '../../Styles/Module.module.scss';
import { BASE_URL } from '../../api';
import Select from '../Select';
import { useEffect, useState } from 'react';

function Question({index, qid, prompt, information, image, answers, updateQuestionInfo}){
    
    return(
        <div className={styles.window}>
            <div className={styles.header}>
                {prompt}
            </div>
            <div className={styles.content}>
                {information}
                {image &&
                    <div className={styles.imgContainer}>
                        <img src={`${BASE_URL}/images/question/${qid}.${image}`}/>
                    </div>
                }

                <div className={styles.options}>
                    <span>Select the correct answer(s):</span>
                    
                    {answers.map((answer, aIndex) => {
                        return(
                            <div key={aIndex} className={styles.option}>
                                <Select update={(value) => {updateQuestionInfo(index, aIndex, value)}}/>
                                <span>{answer}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Question;