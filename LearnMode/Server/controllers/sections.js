import db from './../database/database.js'

export const getSections = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let sql = "SELECT sid, mid, sections.name as section_name, Modules.name as module_name, sections.date_created, image FROM sections LEFT JOIN Modules on Modules.mid = Sections.module WHERE creator=? ORDER BY modules.date_created DESC, sections.name ASC;";
        db.query(sql, [user_id], (error, result) => {
            if(error){
                throw error;
            }

            return res.status(200).json(result);
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const createSection = async (req, res) => {
    
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let section = req.body;

        if(!section?.module){
            console.log("Missing parameter");
            
            return res.status(400).send("Missing parameter");
        }

        let allowed = false;

        await new Promise((resolve, reject) => {
            let sql = "SELECT mid, name, image FROM modules WHERE mid=? AND creator=?;";
            db.query(sql, [section.module, user_id], (error, result) => {
                if(error){
                    throw error;
                }

                allowed = result.length > 0;

                resolve();
            });
        });
        
        //User does not have permission to make a section with that module 
        if(!allowed){
            return res.status(403).send("Unauthorized");
        }

        const name = section.name || "(No Name)";
        const code = section.code || "";

        const payload = [name, user_id, section.module, code];

        await new Promise((resolve, reject) => {
            let sql = "INSERT INTO Sections(name, professor, module, code) VALUES(?, ?, ?, ?);";
            db.query(sql, payload, (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);

                resolve();
            });
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}