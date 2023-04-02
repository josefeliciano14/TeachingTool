export const uploadFile = async (req, res) => {
    
    try{
        Object.keys(req.files).forEach(key => {
            const file = req.files[key];
            
            //const filepath = process.cwd() + `\\dynamic\\${file.name}`;
            const filepath = "F:\\Development\\Capstone\\TeachingTool\\LearnMode\\Server\\dynamic\\" + file.name;
    
            console.log();
    
            console.log(file);
    
            file.mv(filepath);
        })
    
        res.status(200).json({message: "File Uploaded"});
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
};

export const getFile = async (req, res) => {
    
    res.sendFile("F:\\Development\\Capstone\\TeachingTool\\LearnMode\\Server\\dynamic\\index.html");
};