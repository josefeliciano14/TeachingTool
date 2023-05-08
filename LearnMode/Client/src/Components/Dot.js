import styles from '../Styles/Module.module.scss' 
import { useEffect, useRef, useState } from 'react';
import { gsap, TimelineLite } from 'gsap';

function Dot({x, y, width, height, text}){

    const [hidden, setHidden] = useState(true);

    const dot = useRef();
    const tl = useRef<gsap.core.Timeline | null>(null);

    function hideBox(){
        setHidden((prev) => {
            return !prev;
        });
    }

    useEffect(() => {
        const timeline = new TimelineLite();

        timeline.to(dot.current, 0.2, {})
        timeline.to(dot.current, 0.2, { 
            width: '+=15px',
            height: '+=15px',
        })
        .to(dot.current, 0.2, {
            width: '-=15px',
            height: '-=15px',
        });
    }, []);

    return(
        <div className={styles.dotContainer} style={{left: x*width, top: y*height}}>
            <div className={styles.dot} onClick={hideBox} ref={dot} id="dot"></div>
            <div className={styles.textBox} style={{display: hidden ? "none" : "block", left: "1vw"}}>
                <span>{text}</span>
            </div>
        </div>
    )
}

export default Dot;