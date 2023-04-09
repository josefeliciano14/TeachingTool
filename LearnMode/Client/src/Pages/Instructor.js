import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { getInstructor } from "../api";

function Instructor(){
    
    const {iid, sid} = useParams();
    
    const [instructor, setInstructor] = useState({});

    useEffect(() => {
        getInstructor(iid, sid)
            .then((res) => {
                console.log(res.data);

                setInstructor(res.data);
            });
    }, []);
    
    return(
        <main>
            <Navbar/>
            {instructor.iid ?
                    <h1>{`Instructor: ${instructor.first_name} ${instructor.last_name}`}</h1>    
                :
                    <h1>Loading...</h1>
            }
        </main>
    )
}

export default Instructor;