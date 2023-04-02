import { uploadDynamic } from "../api";
import Navbar from "../Components/Navbar";

function Module(){
    function handleFileChange(e){
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        uploadDynamic(formData);
    }
    
    return(
        <main>
            <Navbar/>

            <input type="file" onChange={handleFileChange}/>

            <iframe style={{width: "100%", height: "100%"}} src="http://localhost:5000/dynamic"/>
        </main>
    )
}

export default Module;